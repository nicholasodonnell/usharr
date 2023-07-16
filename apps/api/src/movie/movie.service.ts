import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { Movie, Rule, Tag } from '@usharr/types'

import { PrismaService } from '../prisma/prisma.service'
import { RuleService } from '../rule/rule.service'
import { UtilService } from '../util/util.service'

export type MoviePayload = Required<Pick<Movie, 'id'>> &
  Partial<Omit<Movie, 'id' | 'tags'> & { tags: Pick<Tag, 'id'>[] }>

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const select: Prisma.MovieSelect = {
  id: true,
  title: true,
  alternativeTitles: true,
  tmdbId: true,
  poster: true,
  watched: true,
  lastWatchedAt: true,
  ignored: true,
  deleted: true,
  downloadedAt: true,
  imdbRating: true,
  tmdbRating: true,
  metacriticRating: true,
  rottenTomatoesRating: true,
  appearsInList: true,
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  deletedAt: true,
}

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name)

  constructor(
    private prisma: PrismaService,
    private rule: RuleService,
    private util: UtilService,
  ) {}

  // priv methods //

  private serializeRecord(record): Movie {
    const {
      id,
      title,
      alternativeTitles,
      tmdbId,
      poster,
      watched,
      lastWatchedAt,
      ignored,
      deleted,
      downloadedAt,
      imdbRating,
      tmdbRating,
      metacriticRating,
      rottenTomatoesRating,
      appearsInList,
      tags = [],
      deletedAt,
    } = record

    return {
      id,
      title,
      alternativeTitles: alternativeTitles?.split(',') ?? [],
      tmdbId,
      poster,
      watched,
      lastWatchedAt: lastWatchedAt ? new Date(lastWatchedAt) : null,
      ignored,
      deleted,
      downloadedAt: downloadedAt ? new Date(downloadedAt) : null,
      imdbRating,
      tmdbRating,
      metacriticRating,
      rottenTomatoesRating,
      appearsInList,
      tags: tags.map((tag) => tag.tag),
      deletedAt: deletedAt ? new Date(deletedAt) : null,
    }
  }

  private withDaysUntilDeletion(movie: Movie, rule: Rule): Movie {
    const { downloadedAt, lastWatchedAt } = movie
    const { downloadedDaysAgo, watchedDaysAgo } = rule

    const daysUntilDeletion = Math.min(
      downloadedDaysAgo
        ? downloadedDaysAgo - this.util.daysSince(downloadedAt)
        : Infinity,
      watchedDaysAgo && lastWatchedAt
        ? watchedDaysAgo - this.util.daysSince(lastWatchedAt)
        : Infinity,
    )

    return {
      ...movie,
      daysUntilDeletion: daysUntilDeletion === Infinity ? 0 : daysUntilDeletion,
    }
  }

  // public methods //

  /**
   * Returns a list of all movies
   */
  async getAll(): Promise<Movie[]> {
    try {
      return await this.findMany()
    } catch (e) {
      const error = new Error(`Failed to get all movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Returns a list of monitored movies. Monitored movies are movies that match at least one rule excluding:
   * - movies that are explicitly ignored
   * - movies that are deleted
   * - last watched age (variable)
   * - download age (variable)
   */
  async getMonitored(): Promise<Movie[]> {
    try {
      const enabledRules: Rule[] = await this.rule.getEnabled()
      const moviesMap: Record<number, Movie> = {}

      for (const rule of enabledRules) {
        const records: Movie[] = await this.getForRule(rule, true).then(
          (movies) =>
            movies.map((movie) => this.withDaysUntilDeletion(movie, rule)),
        )

        // dedupe movies based on `daysUntilDeletion`
        for (const record of records) {
          const { id, daysUntilDeletion } = record

          if (
            !moviesMap[id] ||
            moviesMap[id].daysUntilDeletion > daysUntilDeletion
          ) {
            moviesMap[id] = record
          }
        }
      }

      return Object.values(moviesMap).sort(
        (a, b) => a.daysUntilDeletion - b.daysUntilDeletion,
      )
    } catch (e) {
      const error = new Error(`Failed to get monitored movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Returns a list of ignored movies. Ignored movies are movies that are not monitored or explicitly ignored
   */
  async getIgnored(): Promise<Movie[]> {
    try {
      const monitoredIds = await this.getMonitored().then((movies) =>
        movies.map((movie) => movie.id),
      )

      const where: Prisma.MovieWhereInput = {
        id: {
          notIn: monitoredIds,
        },
        deleted: false,
      }

      return await this.findMany({ where })
    } catch (e) {
      const error = new Error(`Failed to get ignored movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Returns a list of deleted movies
   */
  async getDeleted(): Promise<Movie[]> {
    try {
      return await this.findMany({ where: { deleted: true } })
    } catch (e) {
      const error = new Error(`Failed to get deleted movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Returns a list of not deleted movies
   */
  async getNotDeleted(): Promise<Movie[]> {
    try {
      return await this.findMany({ where: { deleted: false } })
    } catch (e) {
      const error = new Error(`Failed to get not deleted movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Returns a list of movies that match the provided rule
   * @param ignoreVariable If true, variable rules (downloadedDaysAgo, watchedDaysAgo) will be ignored
   */
  async getForRule(rule: Rule, ignoreVariable = false): Promise<Movie[]> {
    try {
      const {
        downloadedDaysAgo,
        watched,
        watchedDaysAgo,
        appearsInList,
        minimumImdbRating,
        minimumTmdbRating,
        minimumMetacriticRating,
        minimumRottenTomatoesRating,
        tags,
      } = rule

      const where: Prisma.MovieWhereInput = {
        ignored: false,
        deleted: false,
        watched: watched ?? undefined,
        lastWatchedAt:
          !ignoreVariable && watchedDaysAgo
            ? {
                lte: new Date(Date.now() - watchedDaysAgo * ONE_DAY_MS),
              }
            : undefined,
        appearsInList: appearsInList ?? undefined,
        downloadedAt:
          !ignoreVariable && downloadedDaysAgo
            ? {
                lte: new Date(Date.now() - downloadedDaysAgo * ONE_DAY_MS),
              }
            : undefined,
        imdbRating: minimumImdbRating
          ? {
              lte: minimumImdbRating,
            }
          : undefined,
        tmdbRating: minimumTmdbRating
          ? {
              lte: minimumTmdbRating,
            }
          : undefined,
        metacriticRating: minimumMetacriticRating
          ? {
              lte: minimumMetacriticRating,
            }
          : undefined,
        rottenTomatoesRating: minimumRottenTomatoesRating
          ? {
              lte: minimumRottenTomatoesRating,
            }
          : undefined,
        tags: tags.length
          ? {
              some: {
                tagId: {
                  in: tags.map((tag) => tag.id),
                },
              },
            }
          : undefined,
      }

      return await this.findMany({ where })
    } catch (e) {
      const error = new Error(`Failed to get movies for rule: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Create a new movie record if one does not exist, otherwise update the existing record
   */
  async createOrUpdate(movie: MoviePayload): Promise<Movie> {
    try {
      const {
        id,
        title,
        alternativeTitles,
        tmdbId,
        poster,
        watched,
        lastWatchedAt,
        ignored,
        deleted,
        downloadedAt,
        imdbRating,
        tmdbRating,
        metacriticRating,
        rottenTomatoesRating,
        appearsInList,
        tags,
        deletedAt,
      } = movie

      const data = {
        title,
        alternativeTitles: alternativeTitles?.join(',') ?? undefined,
        tmdbId,
        poster,
        watched,
        lastWatchedAt,
        ignored,
        deleted,
        downloadedAt,
        imdbRating,
        tmdbRating,
        metacriticRating,
        rottenTomatoesRating,
        appearsInList,
        tags: tags
          ? {
              create: tags.map((tag) => ({
                tag: {
                  connect: {
                    id: tag.id,
                  },
                },
              })),
            }
          : undefined,
        deletedAt,
      }

      return await this.upsert({
        create: { id, ...data },
        update: data,
        where: { id },
      })
    } catch (e) {
      const error = new Error(`Failed to create or update movie: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Delete a movie by id
   */
  async deleteById(id: number): Promise<void> {
    try {
      await this.update({
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
        where: { id },
      })
    } catch (e) {
      const error = new Error(`Failed to delete movie: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Delete movies that are not in the provided list of ids
   */
  async deleteWhereNotIds(ids: number[]): Promise<void> {
    try {
      await this.updateMany({
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
        where: {
          id: {
            notIn: ids,
          },
          deleted: false,
        },
      })
    } catch (e) {
      const error = new Error(`Failed to delete movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  // database methods //

  private async findMany(
    params: {
      orderBy?: Prisma.MovieOrderByWithRelationInput
      skip?: number
      take?: number
      where?: Prisma.MovieWhereInput
    } = {},
  ): Promise<Movie[]> {
    const { orderBy, skip, take, where } = params

    const records = await this.prisma.movie.findMany({
      orderBy,
      select,
      skip,
      take,
      where,
    })

    return records.map(this.serializeRecord)
  }

  private async updateMany(params: {
    data: Prisma.MovieUpdateManyMutationInput
    where?: Prisma.MovieWhereInput
  }): Promise<void> {
    const { data, where } = params

    await this.prisma.movie.updateMany({
      data,
      where,
    })
  }

  private async update(params: {
    where: Prisma.MovieWhereUniqueInput
    data?: Prisma.MovieUpdateInput
  }): Promise<Movie> {
    const { where, data } = params

    const record = await this.prisma.movie.update({
      select,
      where,
      data,
    })

    return this.serializeRecord(record)
  }

  private async upsert(params: {
    create: Prisma.MovieCreateInput
    update: Prisma.MovieUpdateInput
    where: Prisma.MovieWhereUniqueInput
  }): Promise<Movie> {
    const { create, update, where } = params

    return await this.prisma.$transaction(async (trx) => {
      // delete all existing tags when updating tags
      if (create.tags || update.tags) {
        await trx.movieTag.deleteMany({
          where: {
            movieId: where.id,
          },
        })
      }

      const record = await trx.movie
        .upsert({
          create,
          select,
          update,
          where,
        })
        .then(this.serializeRecord)

      return record
    })
  }
}
