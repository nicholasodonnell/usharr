import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../prisma.service'
import { TagDTO } from '../tag/tag.dto'
import { Tag } from '../tag/tag.model'

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name)

  readonly select: Prisma.TagSelect = {
    createdAt: true,
    id: true,
    name: true,
    updatedAt: true,
  }

  constructor(private prisma: PrismaService) {}

  private async deleteMany(where: Prisma.TagWhereInput): Promise<void> {
    await this.prisma.tag.deleteMany({
      where,
    })
  }

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
      select: this.select,
      skip,
      take,
      where,
    })

    return records.map(this.serializeRecord)
  }

  private serializeRecord(record): Tag {
    const { createdAt, id, name, updatedAt } = record

    return new Tag({
      createdAt,
      id,
      name,
      updatedAt,
    })
  }

  private async upsert(params: {
    create?: Prisma.TagCreateInput
    update?: Prisma.TagUpdateInput
    where?: Prisma.TagWhereUniqueInput
  }): Promise<Tag> {
    const { create, update, where } = params

    const record = await this.prisma.tag.upsert({
      create,
      select: this.select,
      update,
      where,
    })

    return this.serializeRecord(record)
  }

  /**
   * Create a new tag record if one does not exist, otherwise update the existing record
   */
  async createOrUpdate(tag: TagDTO): Promise<Tag> {
    try {
      const { id, name } = tag

      const data = { name }

      const record = await this.upsert({
        create: { id, ...data },
        update: data,
        where: { id },
      })

      return this.serializeRecord(record)
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
