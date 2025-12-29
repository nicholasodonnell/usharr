import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })

    super({ adapter })
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
