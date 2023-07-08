import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import type { Rule } from '@usharr/types'

import { RuleService } from './rule.service'

@Controller('api/rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Get()
  async get(): Promise<Rule[]> {
    return await this.ruleService.getAll()
  }

  @Post()
  async create(@Body() rule: Rule): Promise<Rule> {
    return await this.ruleService.createOrUpdate(rule)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() rule: Rule): Promise<Rule> {
    return await this.ruleService.createOrUpdate({ ...rule, id: +id })
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.ruleService.deleteById(+id)
  }
}
