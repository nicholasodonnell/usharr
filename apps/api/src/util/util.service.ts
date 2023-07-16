import { Injectable, Logger } from '@nestjs/common'

const ONE_DAY_MS = 1000 * 60 * 60 * 24

@Injectable()
export class UtilService {
  private readonly logger = new Logger(UtilService.name)

  public daysSince(date: Date): number {
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    return Math.floor(diff / ONE_DAY_MS)
  }
}
