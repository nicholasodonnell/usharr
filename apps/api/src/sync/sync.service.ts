import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type {
  Movie,
  RadarrMovie,
  RadarrPing,
  RadarrTag,
  Rule,
  Sync,
  SyncType,
  Tag,
  TautulliMediaInfo,
  TautulliPing,
} from '@usharr/types'

import { MovieService } from '../movie/movie.service'
import { PrismaService } from '../prisma/prisma.service'
import { RadarrService } from '../radarr/radarr.service'
import { RuleService } from '../rule/rule.service'
import { TagService } from '../tag/tag.service'
import { TautulliService } from '../tautulli/tautulli.service'

const select: Prisma.SyncSelect = {
  id: true,
  type: true,
  startedAt: true,
  finishedAt: true,
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name)

  static readonly FULL: SyncType = 'FULL'
  static readonly PARTIAL: SyncType = 'PARTIAL'

  constructor(
    private movie: MovieService,
    private prisma: PrismaService,
    private radarr: RadarrService,
    private rule: RuleService,
    private tag: TagService,
    private tautulli: TautulliService,
  ) {}

  // priv methods //

  private serializeRecord(record): Sync {
    const { id, type, startedAt, finishedAt } = record

    return {
      id,
      type,
      startedAt: new Date(startedAt),
      finishedAt: finishedAt ? new Date(startedAt) : null,
    }
  }

  // public methods //

  /**
   * Creates a new sync record in the database with the given type and started at the current time
   */
  async start(type: SyncType): Promise<Sync> {
    try {
      return await this.create({
        startedAt: new Date(),
        type,
      })
    } catch (e) {
      const error = new Error(`Failed to start sync: ${e.message}`)
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
   * Returns the last finished FULL sync
   */
  async getLastFull(): Promise<Sync | null> {
    try {
      return this.findFirst({
        where: {
          type: SyncService.FULL,
          finishedAt: { not: null },
        },
        orderBy: { finishedAt: 'desc' },
      })
    } catch (e) {
      const error = new Error(`Failed to get last full sync: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Marks the sync with the given id as finished with the current time
   */
  async finish(id: number): Promise<Sync> {
    try {
      return await this.update({
        where: { id },
        data: { finishedAt: new Date() },
      })
    } catch (e) {
      const error = new Error(`Failed to finish sync: ${e.message}`)
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
      const radarrMovieIds: number[] = radarrMovies.map((movie) => movie.id)

      for await (const radarrMovie of radarrMovies) {
        // skip movies that have not been downloaded
        if (!radarrMovie.hasFile) continue

        const movie: Movie = await this.movie.createOrUpdate({
          id: radarrMovie.id,
          alternativeTitles:
            radarrMovie.alternateTitles?.map((title) => title.title) ??
            undefined,
          tmdbId: radarrMovie.tmdbId,
          deleted: false,
          downloadedAt: radarrMovie.movieFile?.dateAdded,
          imdbRating: radarrMovie.ratings?.imdb?.value
            ? Math.floor(radarrMovie.ratings.imdb.value * 10)
            : null,
          tmdbRating: radarrMovie.ratings?.tmdb?.value
            ? Math.floor(radarrMovie.ratings.tmdb.value * 10)
            : null,
          metacriticRating: radarrMovie.ratings?.metacritic?.value
            ? Math.floor(radarrMovie.ratings.metacritic.value)
            : null,
          rottenTomatoesRating: radarrMovie.ratings?.rottenTomatoes?.value
            ? Math.floor(radarrMovie.ratings.rottenTomatoes.value)
            : null,
          poster: radarrMovie.images?.find(
            (image) => image.coverType === 'poster',
          )?.remoteUrl,
          tags: radarrMovie.tags?.map((tag) => ({ id: tag })) ?? [],
          title: radarrMovie.title,
          deletedAt: null,
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

  /**
   * Sync the watch status of all non-deleted movies from Tautulli
   * Syncing is done by searching the Tautulli history for the movie title(s)
   */
  async watchHistory(): Promise<void> {
    try {
      const ping: TautulliPing = await this.tautulli.ping()

      if (!ping.success) {
        throw new Error(`Could not establish connection to Tautulli`)
      }

      const moviesToSync: Movie[] = await this.movie.getNotDeleted()

      for await (const movieToSync of moviesToSync) {
        const mediaInfo: TautulliMediaInfo | undefined =
          await this.tautulli.searchHistoryForAllMovieTitles([
            movieToSync.title,
            ...movieToSync.alternativeTitles,
          ])

        if (!mediaInfo) {
          this.logger.warn(`No watch history found for "${movieToSync.title}"`)

          continue
        }

        const movie: Movie = await this.movie.createOrUpdate({
          ...movieToSync,
          watched: mediaInfo.play_count > 0,
          lastWatchedAt: mediaInfo.last_played
            ? new Date(mediaInfo.last_played * 1000)
            : null,
        })

        this.logger.log(`Synced watch history for "${movie.title}"`)
      }
    } catch (e) {
      const error = new Error(`Failed to sync watch history: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
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
   * Performs a FULL sync:
   * - update all movies
   * - update all tags
   * - update watch history
   * - delete movies for rules
   */
  async full(): Promise<void> {
    let sync: Sync = null

    try {
      this.logger.log('Starting full sync')
      sync = await this.start(SyncService.FULL)

      await this.tags()
      await this.movies()
      await this.watchHistory()
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
   * Performs a PARTIAL sync:
   * - update all movies
   * - update all tags
   * - update watch history
   */
  async partial(): Promise<void> {
    let sync: Sync = null

    try {
      this.logger.log('Starting partial sync')
      sync = await this.start(SyncService.PARTIAL)

      await this.tags()
      await this.movies()
      await this.watchHistory()

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

  // database methods //

  private async create(data?: Prisma.SyncCreateInput): Promise<Sync> {
    const record = await this.prisma.sync.create({
      select,
      data,
    })

    return this.serializeRecord(record)
  }

  private async update(params: {
    where: Prisma.SyncWhereUniqueInput
    data?: Prisma.SyncUpdateInput
  }): Promise<Sync> {
    const { where, data } = params

    const record = await this.prisma.sync.update({
      select,
      where,
      data,
    })

    return this.serializeRecord(record)
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

  private async findFirst(params: {
    where: Prisma.SyncWhereInput
    orderBy?: Prisma.SyncOrderByWithRelationInput
  }): Promise<Sync | null> {
    const { where, orderBy } = params

    const record = await this.prisma.sync.findFirst({
      select,
      where,
      orderBy,
    })

    return record ? this.serializeRecord(record) : null
  }
}
