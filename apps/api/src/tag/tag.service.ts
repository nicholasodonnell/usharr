import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { Tag } from '@usharr/types'

import { PrismaService } from '../prisma.service'

export type TagPayload = Required<Pick<Tag, 'id'>> & Partial<Omit<Tag, 'id'>>

const select: Prisma.TagSelect = {
  id: true,
  name: true,
}

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name)

  constructor(private prisma: PrismaService) {}

  // priv methods //

  private async deleteMany(where: Prisma.TagWhereInput): Promise<void> {
    await this.prisma.tag.deleteMany({
      where,
    })
  }

  // public methods //

  private async findMany(
    params: {
      orderBy?: Prisma.TagOrderByWithRelationInput
      skip?: number
      take?: number
      where?: Prisma.TagWhereInput
    } = {},
  ): Promise<Tag[]> {
    const { orderBy, skip, take, where } = params

    const records = await this.prisma.tag.findMany({
      orderBy,
      select,
      skip,
      take,
      where,
    })

    return records.map(this.serializeRecord)
  }

  private serializeRecord(record): Tag {
    return {
      id: record.id,
      name: record.name,
    }
  }

  private async upsert(params: {
    create: Prisma.TagCreateInput
    select?: Prisma.TagSelect
    update: Prisma.TagUpdateInput
    where: Prisma.TagWhereUniqueInput
  }): Promise<Tag> {
    const { create, update, where } = params

    const record = await this.prisma.tag.upsert({
      create,
      select,
      update,
      where,
    })

    return this.serializeRecord(record)
  }

  // database methods //

  /**
   * Create a new tag record if one does not exist, otherwise update the existing record
   */
  async createOrUpdate(tag: TagPayload): Promise<Tag> {
    try {
      const { id, name } = tag

      const data = { name }

      return await this.upsert({
        create: { id, ...data },
        update: data,
        where: { id },
      })
    } catch (e) {
      const error = new Error(`Failed to create or update tag: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Delete tags that are not in the provided list of ids
   */
  async deleteWhereNotIds(ids: number[]): Promise<void> {
    try {
      await this.deleteMany({
        id: {
          notIn: ids,
        },
      })
    } catch (e) {
      const error = new Error(
        `Failed to delete tags where not ids: ${e.message}`,
      )
      this.logger.error(error)

      throw error
    }
  }

  /**
   * Returns a list of all tags
   */
  async getAll(): Promise<Tag[]> {
    try {
      return await this.findMany()
    } catch (e) {
      const error = new Error(`Failed to get all tags: ${e.message}`)
      this.logger.error(error)

      throw error
    }
  }
}
