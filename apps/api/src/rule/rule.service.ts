import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { Rule, Tag } from '@usharr/types'

import { PrismaService } from '../prisma/prisma.service'

export type RulePayload = Pick<Rule, 'id'> &
  Omit<Rule, 'id' | 'tags'> & { tags: Pick<Tag, 'id'>[] }

const select: Prisma.RuleSelect = {
  id: true,
  name: true,
  enabled: true,
  downloadedDaysAgo: true,
  watched: true,
  watchedDaysAgo: true,
  appearsInList: true,
  minimumImdbRating: true,
  minimumTmdbRating: true,
  minimumMetacriticRating: true,
  minimumRottenTomatoesRating: true,
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
}

@Injectable()
export class RuleService {
  private readonly logger = new Logger(RuleService.name)

  constructor(private prisma: PrismaService) {}

  // priv methods //

  private serializeRecord(record): Rule {
    const {
      id,
      name,
      enabled,
      downloadedDaysAgo,
      watched,
      watchedDaysAgo,
      appearsInList,
      minimumImdbRating,
      minimumTmdbRating,
      minimumMetacriticRating,
      minimumRottenTomatoesRating,
      tags = [],
    } = record

    return {
      id,
      name,
      enabled,
      downloadedDaysAgo,
      watched,
      watchedDaysAgo,
      appearsInList,
      minimumImdbRating,
      minimumTmdbRating,
      minimumMetacriticRating,
      minimumRottenTomatoesRating,
      tags: tags.map((tag) => tag.tag),
    }
  }

  // public methods //

  /**
   * Returns a list of all rules
   */
  async getAll(): Promise<Rule[]> {
    try {
      return await this.findMany()
    } catch (e) {
      const error = new Error(`Failed to get all rules: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Returns a list of enabled rules
   */
  async getEnabled(): Promise<Rule[]> {
    try {
      return await this.findMany({ where: { enabled: true } })
    } catch (e) {
      const error = new Error(`Failed to get enabled rules: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Create a new rule record if one does not exist, otherwise update the existing record
   */
  async createOrUpdate(rule: RulePayload): Promise<Rule> {
    try {
      const {
        id,
        name,
        enabled,
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

      const data = {
        name,
        enabled,
        downloadedDaysAgo,
        watched,
        watchedDaysAgo: watched ? watchedDaysAgo : null,
        appearsInList,
        minimumImdbRating,
        minimumTmdbRating,
        minimumMetacriticRating,
        minimumRottenTomatoesRating,
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
      }

      return await this.upsert({
        create: data,
        update: data,
        where: { id: id ?? -1 },
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
          tags: {
            some: {},
          },
          AND: {
            tags: {
              none: {
                tagId: {
                  in: ids,
                },
              },
            },
          },
        },
      })
    } catch (e) {
      const error = new Error(`Failed to disable rules: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  // database methods //

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
      select,
      skip,
      take,
      where,
    })

    return records.map(this.serializeRecord)
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
      const record = await trx.rule
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

  private async delete(where: Prisma.RuleWhereUniqueInput) {
    await this.prisma.rule.delete({
      where,
    })
  }
}
