import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type {
  ImportlistMovie,
  Movie,
  RadarrMovie,
  RadarrPing,
  RadarrTag,
  Rule,
  SyncType,
  Tag,
  TautulliHistory,
  TautulliPing,
} from '@usharr/types'

import { MovieService } from '../movie/movie.service'
import { PrismaService } from '../prisma.service'
import { RadarrService } from '../radarr/radarr.service'
import { RuleService } from '../rule/rule.service'
import { TagService } from '../tag/tag.service'
import { TautulliService } from '../tautulli/tautulli.service'

import { Sync } from './sync.model'

const select: Prisma.SyncSelect = {
  finishedAt: true,
  id: true,
  startedAt: true,
  type: true,
}

@Injectable()
export class SyncService {
  static readonly FULL: SyncType = 'FULL'
  static readonly PARTIAL: SyncType = 'PARTIAL'
  private readonly logger = new Logger(SyncService.name)

  constructor(
    private movie: MovieService,
    private prisma: PrismaService,
    private radarr: RadarrService,
    private rule: RuleService,
    private tag: TagService,
    private tautulli: TautulliService,
  ) {}

  private async create(data?: Prisma.SyncCreateInput): Promise<Sync> {
    const record = await this.prisma.sync.create({
      data,
      select,
    })

    return this.serializeRecord(record)
  }

  private async findFirst(params: {
    orderBy?: Prisma.SyncOrderByWithRelationInput
    where: Prisma.SyncWhereInput
  }): Promise<Sync | null> {
    const { orderBy, where } = params

    const record = await this.prisma.sync.findFirst({
      orderBy,
      select,
      where,
    })

    return record ? this.serializeRecord(record) : null
  }

  private async findMany(
    params: {
      orderBy?: Prisma.SyncOrderByWithRelationInput
      skip?: number
      take?: number
      where?: Prisma.SyncWhereInput
    } = {},
  ): Promise<Sync[]> {
    const { orderBy, skip, take, where } = params

    const records = await this.prisma.sync.findMany({
      orderBy,
      select,
      skip,
      take,
      where,
    })

    return records.map(this.serializeRecord)
  }

  private serializeRecord(record): Sync {
    const { finishedAt, id, startedAt, type } = record

    return new Sync({
      finishedAt: finishedAt ? new Date(finishedAt) : null,
      id,
      startedAt: new Date(startedAt),
      type,
    })
  }

  private async update(params: {
    data?: Prisma.SyncUpdateInput
    where: Prisma.SyncWhereUniqueInput
  }): Promise<Sync> {
    const { data, where } = params

    const record = await this.prisma.sync.update({
      data,
      select,
      where,
    })

    return this.serializeRecord(record)
  }

  /**
   * Deletes movies that match a rule
   */
  async deleteMovies(): Promise<void> {
    try {
      const enabledRules: Rule[] = await this.rule.getEnabled()

      for await (const rule of enabledRules) {
        const moviesToDelete: Movie[] = await this.movie.getForRule(rule)

        for await (const movie of moviesToDelete) {
          await this.radarr.deleteMovie(movie.id)
          await this.movie.deleteById(movie.id)

          this.logger.log(
            `Deleted movie "${movie.title}" for rule "${rule.name}"`,
          )
        }
      }
    } catch (e) {
      const error = new Error(`Failed to delete movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Marks the sync with the given id as finished with the current time
   */
  async finish(id: number): Promise<Sync> {
    try {
      const record = await this.update({
        data: { finishedAt: new Date() },
        where: { id },
      })

      return this.serializeRecord(record)
    } catch (e) {
      const error = new Error(`Failed to finish sync: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Performs a FULL sync:
   * - update all movies
   * - update all tags
   * - update watch history since the beginning of time
   * - delete movies for rules
   */
  async full(): Promise<void> {
    let sync: Sync = null

    try {
      this.logger.log('Starting full sync')
      sync = await this.start(SyncService.FULL)

      const lastSync: Sync | null = await this.getLast()

      await this.tags()
      await this.movies()
      await this.watchHistory(lastSync?.finishedAt)
      await this.deleteMovies()

      this.logger.log('Finished full sync')
    } catch (e) {
      const error = new Error(`Failed to perform full sync: ${e.message}`)
      this.logger.error(error.message)

      throw error
    } finally {
      await this.finish(sync.id).catch(() => {
        /* noop */
      })
    }
  }

  /**
   * Returns the last finished FULL sync
   */
  async getLast(type?: SyncType): Promise<Sync | null> {
    try {
      return await this.findFirst({
        orderBy: { finishedAt: 'desc' },
        where: {
          finishedAt: { not: null },
          ...(type ? { type } : {}),
        },
      })
    } catch (e) {
      const error = new Error(`Failed to get last full sync: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Returns a list of all syncs that are currently running (no finishedAt date)
   */
  async getRunning(): Promise<Sync[]> {
    try {
      return this.findMany({
        where: { finishedAt: null },
      })
    } catch (e) {
      const error = new Error(`Failed to get running syncs: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Grab all movies from Radarr and create/update them in the database
   * Any movies that are not in Radarr are deleted
   */
  async movies(): Promise<void> {
    try {
      const ping: RadarrPing = await this.radarr.ping()

      if (!ping.success) {
        throw new Error(`Could not establish connection to Radarr`)
      }

      const radarrMovies: RadarrMovie[] = await this.radarr.getMovies()
      const importlistMovies: ImportlistMovie[] =
        await this.radarr.getImportlistMovies()

      const radarrMovieIds: number[] = radarrMovies.map((movie) => movie.id)
      const importlistMoviesTmdbIds: number[] = importlistMovies.map(
        (movie) => movie.tmdbId,
      )
      const radarrTags: RadarrTag[] = await await this.radarr.getTags()

      for await (const radarrMovie of radarrMovies) {
        // skip movies that have not been downloaded
        if (!radarrMovie.hasFile) continue

        const tags = radarrTags.filter((tag) =>
          radarrMovie.tags.includes(tag.id),
        )

        const movie: Movie = await this.movie.createOrUpdate({
          alternativeTitles:
            radarrMovie.alternateTitles?.map((title) => title.title) ??
            undefined,
          appearsInList: importlistMoviesTmdbIds.includes(radarrMovie.tmdbId),
          deleted: false,
          deletedAt: null,
          downloadedAt: radarrMovie.movieFile?.dateAdded,
          id: radarrMovie.id,
          ignored: false,
          imdbRating: radarrMovie.ratings?.imdb?.value
            ? Math.floor(radarrMovie.ratings.imdb.value * 10)
            : null,
          lastWatchedAt: null,
          metacriticRating: radarrMovie.ratings?.metacritic?.value
            ? Math.floor(radarrMovie.ratings.metacritic.value)
            : null,
          poster: radarrMovie.images
            ?.find((image) => image.coverType === 'poster')
            ?.remoteUrl?.replace(/original/, 'w500'),
          rottenTomatoesRating: radarrMovie.ratings?.rottenTomatoes?.value
            ? Math.floor(radarrMovie.ratings.rottenTomatoes.value)
            : null,
          tags: tags?.map((tag) => ({ id: tag.id, name: tag.label })) ?? [],
          title: radarrMovie.title,
          tmdbId: radarrMovie.tmdbId,
          tmdbRating: radarrMovie.ratings?.tmdb?.value
            ? Math.floor(radarrMovie.ratings.tmdb.value * 10)
            : null,
          watched: false,
        })

        this.logger.log(`Synced movie "${movie.title}"`)
      }

      // movies not seen in this sync must have been deleted from radarr
      // mark them as deleted
      await this.movie.deleteWhereNotIds(radarrMovieIds)
    } catch (e) {
      const error = new Error(`Failed to sync movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Performs a PARTIAL sync:
   * - update all movies
   * - update all tags
   * - update watch history since the last sync
   */
  async partial(): Promise<void> {
    let sync: Sync = null

    try {
      this.logger.log('Starting partial sync')
      sync = await this.start(SyncService.PARTIAL)

      const lastSync: Sync | null = await this.getLast()

      await this.tags()
      await this.movies()
      await this.watchHistory(lastSync?.finishedAt)

      this.logger.log('Finished partial sync')
    } catch (e) {
      const error = new Error(`Failed to perform partial sync: ${e.message}`)
      this.logger.error(error.message)

      throw error
    } finally {
      await this.finish(sync.id).catch(() => {
        /* noop */
      })
    }
  }

  /**
   * Creates a new sync record in the database with the given type and started at the current time
   */
  async start(type: SyncType): Promise<Sync> {
    try {
      const record = await this.create({
        startedAt: new Date(),
        type,
      })

      return this.serializeRecord(record)
    } catch (e) {
      const error = new Error(`Failed to start sync: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Grab all tags from Radarr and create/update them in the database
   * Any tags that are not in Radarr are deleted
   * Any rules that use tags that are not in Radarr are disabled
   */
  async tags(): Promise<void> {
    try {
      const ping: RadarrPing = await this.radarr.ping()

      if (!ping.success) {
        throw new Error(`Could not establish connection to Radarr`)
      }

      const radarrTags: RadarrTag[] = await this.radarr.getTags()
      const radarrTagIds: number[] = radarrTags.map((tag) => tag.id)

      // tags not seen in this sync must have been deleted from radarr
      // delete them and deactive any rules that use them
      await this.rule.disableWhereNotTagIds(radarrTagIds)
      await this.tag.deleteWhereNotIds(radarrTagIds)

      for await (const radarrTag of radarrTags) {
        const tag: Tag = await this.tag.createOrUpdate({
          id: radarrTag.id,
          name: radarrTag.label,
        })

        this.logger.log(`Synced tag "${tag.name}"`)
      }
    } catch (e) {
      const error = new Error(`Failed to sync tags: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  async watchHistory(since: Date = new Date(0)): Promise<void> {
    try {
      const ping: TautulliPing = await this.tautulli.ping()

      if (!ping.success) {
        throw new Error(`Could not establish connection to Tautulli`)
      }

      const moviesToSync: Movie[] = await this.movie.getNotDeleted()
      const watchHistory: TautulliHistory[] = await this.tautulli.getHistory(
        since,
      )

      for (const movie of moviesToSync) {
        const titles = [movie.title, ...movie.alternativeTitles]

        const history: TautulliHistory | undefined = watchHistory.find(
          (history) => titles.includes(history.title),
        )

        if (!history) {
          continue
        }

        await this.movie.createOrUpdate({
          ...movie,
          lastWatchedAt: history.date,
          watched: true,
        })

        this.logger.log(`Synced watch history for "${movie.title}"`)
      }
    } catch (e) {
      const error = new Error(`Failed to sync watch history: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }
}
