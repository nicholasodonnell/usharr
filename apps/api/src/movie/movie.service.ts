import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { Movie, Rule, Tag } from '@usharr/types'

import { PrismaService } from '../prisma/prisma.service'
import { RuleService } from '../rule/rule.service'

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
      tags: tags.map((tag) => tag.tag),
      deletedAt: deletedAt ? new Date(deletedAt) : null,
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
   * Returns a list of monitored movies. Monitored movies are movies that are:
   * - not ignored
   * - not deleted
   * - has a tag enabled on a rule (if any rule does not have tags, ignore tags)
   * - has a watched status that matches the watched status of all rules (if a rule has a different watched status, ignore watched status)
   */
  async getMonitored(): Promise<Movie[]> {
    try {
      const enabledRules = await this.rule.getEnabled()

      const shouldFilterByTag = enabledRules.every((rule) => rule.tags.length)
      const shouldFilterByWatched = enabledRules.every((rule) => rule.watched)
      const shouldFilterByUnwatched = enabledRules.every(
        (rule) => rule.watched === false,
      )

      const watched = shouldFilterByWatched
        ? true
        : shouldFilterByUnwatched
        ? false
        : undefined
      const tagIds = shouldFilterByTag
        ? enabledRules.flatMap((rule) => rule.tags.map((tag) => tag.id))
        : undefined

      const where: Prisma.MovieWhereInput = {
        watched,
        ignored: false,
        deleted: false,
        tags: {
          some: {
            tagId: {
              in: tagIds,
            },
          },
        },
      }

      return await this.findMany({ where })
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
   */
  async getForRule(rule: Rule): Promise<Movie[]> {
    try {
      const {
        downloadedDaysAgo,
        watched,
        watchedDaysAgo,
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
        lastWatchedAt: watchedDaysAgo
          ? {
              lte: new Date(Date.now() - watchedDaysAgo * ONE_DAY_MS),
            }
          : undefined,
        downloadedAt: downloadedDaysAgo
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
