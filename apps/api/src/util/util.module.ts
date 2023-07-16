import { Module } from '@nestjs/common'

import { UtilService } from './util.service'

@Module({
  controllers: [],
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}
