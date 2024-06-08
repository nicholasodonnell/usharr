import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../prisma.service'
import { Tag } from '../tag/tag.model'

import { RuleDTO } from './rule.dto'
import { Rule } from './rule.model'

@Injectable()
export class RuleService {
  private readonly logger = new Logger(RuleService.name)

  readonly select: Prisma.RuleSelect = {
    appearsInList: true,
    createdAt: true,
    downloadedDaysAgo: true,
    enabled: true,
    id: true,
    minimumImdbRating: true,
    minimumMetacriticRating: true,
    minimumRottenTomatoesRating: true,
    minimumTmdbRating: true,
    name: true,
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
    updatedAt: true,
    watched: true,
    watchedDaysAgo: true,
  }

  constructor(private prisma: PrismaService) {}

  private async delete(where: Prisma.RuleWhereUniqueInput) {
    await this.prisma.rule.delete({
      where,
    })
  }

  private async findMany(
    params: {
      orderBy?: Prisma.RuleOrderByWithRelationInput
      skip?: number
      take?: number
      where?: Prisma.RuleWhereInput
    } = {},
  ): Promise<Rule[]> {
    const { orderBy, skip, take, where } = params

    const records = await this.prisma.rule.findMany({
      orderBy,
      select: this.select,
      skip,
      take,
      where,
    })

    return records.map(this.serializeRecord)
  }

  private async findOne(where: Prisma.RuleWhereUniqueInput): Promise<Rule> {
    const record = await this.prisma.rule.findUnique({
      select: this.select,
      where,
    })

    return this.serializeRecord(record)
  }

  private serializeRecord(record): Rule {
    const {
      appearsInList,
      createdAt,
      downloadedDaysAgo,
      enabled,
      id,
      minimumImdbRating,
      minimumMetacriticRating,
      minimumRottenTomatoesRating,
      minimumTmdbRating,
      name,
      tags = [],
      updatedAt,
      watched,
      watchedDaysAgo,
    } = record

    return new Rule({
      appearsInList,
      createdAt,
      downloadedDaysAgo,
      enabled,
      id,
      minimumImdbRating,
      minimumMetacriticRating,
      minimumRottenTomatoesRating,
      minimumTmdbRating,
      name,
      tags: tags.map((tag) => new Tag(tag.tag)),
      updatedAt,
      watched,
      watchedDaysAgo,
    })
  }

  private async updateMany(params: {
    data: Prisma.RuleUpdateManyMutationInput
    where?: Prisma.RuleWhereInput
  }): Promise<void> {
    const { data, where } = params

    await this.prisma.rule.updateMany({
      data,
      where,
    })
  }

  private async upsert(params: {
    create: Prisma.RuleCreateInput
    update: Prisma.RuleUpdateInput
    where: Prisma.RuleWhereUniqueInput
  }): Promise<Rule> {
    const { create, update, where } = params

    return await this.prisma.$transaction(async (trx) => {
      // delete all tags that are not in the new list
      if (create.tags || update.tags) {
        await trx.ruleTag.deleteMany({
          where: {
            ruleId: where.id,
          },
        })
      }

      const record = await trx.rule.upsert({
        create,
        select: this.select,
        update,
        where,
      })

      return this.serializeRecord(record)
    })
  }

  async create(rule: RuleDTO): Promise<Rule> {
    try {
      const {
        appearsInList,
        downloadedDaysAgo,
        enabled,
        minimumImdbRating,
        minimumMetacriticRating,
        minimumRottenTomatoesRating,
        minimumTmdbRating,
        name,
        tags,
        watched,
        watchedDaysAgo,
      } = rule

      const data = {
        appearsInList,
        downloadedDaysAgo,
        enabled,
        minimumImdbRating,
        minimumMetacriticRating,
        minimumRottenTomatoesRating,
        minimumTmdbRating,
        name,
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
        watched,
        watchedDaysAgo: watched ? watchedDaysAgo : null,
      }

      return await this.upsert({
        create: data,
        update: data,
        where: { id: -1 },
      })
    } catch (e) {
      const error = new Error(`Failed to create or update rule: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Delete a rule by id
   */
  async deleteById(id: number): Promise<void> {
    try {
      await this.delete({ id })
    } catch (e) {
      const error = new Error(`Failed to delete rule: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Disable rules that have tags but do not have any of the provided tag ids associated with them
   */
  async disableWhereNotTagIds(ids: number[]): Promise<void> {
    try {
      await this.updateMany({
        data: { enabled: false },
        where: {
          AND: {
            tags: {
              none: {
                tagId: {
                  in: ids,
                },
              },
            },
          },
          tags: {
            some: {},
          },
        },
      })
    } catch (e) {
      const error = new Error(`Failed to disable rules: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Returns a list of all rules
   */
  async getAll(): Promise<Rule[]> {
    try {
      return await this.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      })
    } catch (e) {
      const error = new Error(`Failed to get all rules: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  async getById(id: number): Promise<Rule> {
    try {
      return await this.findOne({
        id,
      })
    } catch (e) {
      const error = new Error(`Failed to get rule: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Returns a list of enabled rules
   */
  async getEnabled(): Promise<Rule[]> {
    try {
      return await this.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        where: { enabled: true },
      })
    } catch (e) {
      const error = new Error(`Failed to get enabled rules: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  async updateById(id: number, rule: RuleDTO): Promise<Rule> {
    try {
      const {
        appearsInList,
        downloadedDaysAgo,
        enabled,
        minimumImdbRating,
        minimumMetacriticRating,
        minimumRottenTomatoesRating,
        minimumTmdbRating,
        name,
        tags,
        watched,
        watchedDaysAgo,
      } = rule

      const data = {
        appearsInList,
        downloadedDaysAgo,
        enabled,
        minimumImdbRating,
        minimumMetacriticRating,
        minimumRottenTomatoesRating,
        minimumTmdbRating,
        name,
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
        watched,
        watchedDaysAgo: watched ? watchedDaysAgo : null,
      }

      return await this.upsert({
        create: data,
        update: data,
        where: { id },
      })
    } catch (e) {
      const error = new Error(`Failed to create or update rule: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }
}
