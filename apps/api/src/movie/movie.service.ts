import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../prisma.service'
import { Rule } from '../rule/rule.model'
import { RuleService } from '../rule/rule.service'
import { Tag } from '../tag/tag.model'
import { daysSince } from '../util/daysSince'

import { MovieDTO } from './movie.dto'
import { Movie } from './movie.model'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name)

  readonly select: Prisma.MovieSelect = {
    alternativeTitles: true,
    appearsInList: true,
    createdAt: true,
    deleted: true,
    deletedAt: true,
    downloadedAt: true,
    id: true,
    ignored: true,
    imdbRating: true,
    lastWatchedAt: true,
    metacriticRating: true,
    poster: true,
    rottenTomatoesRating: true,
    tags: {
      select: {
        tag: {
          select: {
            createdAt: true,
            id: true,
            name: true,
            updatedAt: true,
          },
        },
      },
    },
    title: true,
    tmdbId: true,
    tmdbRating: true,
    watched: true,
  }

  constructor(
    private prisma: PrismaService,
    private rule: RuleService,
  ) {}

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
      select: this.select,
      skip,
      take,
      where,
    })

    return records.map(this.serializeRecord)
  }

  private serializeRecord(record): Movie {
    const {
      alternativeTitles,
      appearsInList,
      createdAt,
      deleted,
      deletedAt,
      downloadedAt,
      id,
      ignored,
      imdbRating,
      lastWatchedAt,
      metacriticRating,
      poster,
      rottenTomatoesRating,
      tags = [],
      title,
      tmdbId,
      tmdbRating,
      updatedAt,
      watched,
    } = record

    return new Movie({
      alternativeTitles: alternativeTitles?.split(',') ?? [],
      appearsInList,
      createdAt,
      deleted,
      deletedAt: deletedAt ? new Date(deletedAt) : null,
      downloadedAt: downloadedAt ? new Date(downloadedAt) : null,
      id,
      ignored,
      imdbRating,
      lastWatchedAt: lastWatchedAt ? new Date(lastWatchedAt) : null,
      metacriticRating,
      poster,
      rottenTomatoesRating,
      tags: tags.map((tag) => new Tag(tag.tag)),
      title,
      tmdbId,
      tmdbRating,
      updatedAt,
      watched,
    })
  }

  private async update(params: {
    data?: Prisma.MovieUpdateInput
    where: Prisma.MovieWhereUniqueInput
  }): Promise<Movie> {
    const { data, where } = params

    const record = await this.prisma.movie.update({
      data,
      select: this.select,
      where,
    })

    return this.serializeRecord(record)
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

      const record = await trx.movie.upsert({
        create,
        select: this.select,
        update,
        where,
      })

      return this.serializeRecord(record)
    })
  }

  private withComputed(movie: Movie, rule: Rule): Movie {
    const { downloadedAt, lastWatchedAt } = movie
    const { downloadedDaysAgo, watchedDaysAgo } = rule

    const daysUntilDeletion = Math.min(
      downloadedDaysAgo
        ? downloadedDaysAgo - daysSince(downloadedAt)
        : Infinity,
      watchedDaysAgo && lastWatchedAt
        ? watchedDaysAgo - daysSince(lastWatchedAt)
        : Infinity,
    )

    return new Movie({
      ...movie,
      daysUntilDeletion: daysUntilDeletion === Infinity ? 0 : daysUntilDeletion,
      matchedRule: rule,
    })
  }

  /**
   * Create a new movie record if one does not exist, otherwise update the existing record
   */
  async createOrUpdate(movie: MovieDTO): Promise<Movie> {
    try {
      const {
        alternativeTitles,
        appearsInList,
        deleted,
        deletedAt,
        downloadedAt,
        id,
        ignored,
        imdbRating,
        lastWatchedAt,
        metacriticRating,
        poster,
        rottenTomatoesRating,
        tags,
        title,
        tmdbId,
        tmdbRating,
        watched,
      } = movie

      const data = {
        alternativeTitles: alternativeTitles?.join(',') ?? undefined,
        appearsInList,
        deleted,
        deletedAt,
        downloadedAt,
        ignored,
        imdbRating,
        lastWatchedAt,
        metacriticRating,
        poster,
        rottenTomatoesRating,
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
        title,
        tmdbId,
        tmdbRating,
        watched,
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
          deleted: false,
          id: {
            notIn: ids,
          },
        },
      })
    } catch (e) {
      const error = new Error(`Failed to delete movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

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
   * Returns a list of movies that match the provided rule
   * @param ignoreVariable If true, variable rules (downloadedDaysAgo, watchedDaysAgo) will be ignored
   */
  async getForRule(rule: Rule, ignoreVariable = false): Promise<Movie[]> {
    try {
      const {
        appearsInList,
        downloadedDaysAgo,
        minimumImdbRating,
        minimumMetacriticRating,
        minimumRottenTomatoesRating,
        minimumTmdbRating,
        tags,
        watched,
        watchedDaysAgo,
      } = rule

      const where: Prisma.MovieWhereInput = {
        appearsInList: appearsInList ?? undefined,
        deleted: false,
        downloadedAt:
          !ignoreVariable && downloadedDaysAgo
            ? {
                lte: new Date(Date.now() - downloadedDaysAgo * ONE_DAY_MS),
              }
            : undefined,
        ignored: false,
        imdbRating: minimumImdbRating
          ? {
              lte: minimumImdbRating,
            }
          : undefined,
        lastWatchedAt:
          !ignoreVariable && watchedDaysAgo
            ? {
                lte: new Date(Date.now() - watchedDaysAgo * ONE_DAY_MS),
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
        tmdbRating: minimumTmdbRating
          ? {
              lte: minimumTmdbRating,
            }
          : undefined,
        watched: watched ?? undefined,
      }

      return await this.findMany({ where })
    } catch (e) {
      const error = new Error(`Failed to get movies for rule: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Returns a list of ignored movies. Ignored movies are movies that are not monitored or explicitly ignored
   */
  async getIgnored(): Promise<Movie[]> {
    try {
      const monitored = await this.getMonitored()
      const monitoredIds = monitored.map((movie) => movie.id)

      const where: Prisma.MovieWhereInput = {
        deleted: false,
        id: {
          notIn: monitoredIds,
        },
      }

      return await this.findMany({ where })
    } catch (e) {
      const error = new Error(`Failed to get ignored movies: ${e.message}`)
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
        const records: Movie[] = await this.getForRule(rule, true)
        const movies = records.map((movie) => this.withComputed(movie, rule))

        // dedupe movies based on `daysUntilDeletion`
        for (const movie of movies) {
          const { daysUntilDeletion, id } = movie

          if (
            !moviesMap[id] ||
            moviesMap[id].daysUntilDeletion > daysUntilDeletion
          ) {
            moviesMap[id] = movie
          }
        }
      }

      const sorted: Movie[] = Object.values(moviesMap).sort(
        (a, b) => a.daysUntilDeletion - b.daysUntilDeletion,
      )

      return sorted
    } catch (e) {
      const error = new Error(`Failed to get monitored movies: ${e.message}`)
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
}
