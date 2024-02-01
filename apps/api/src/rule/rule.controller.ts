import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { RuleDTO } from './rule.dto'
import { Rule } from './rule.model'
import { RuleService } from './rule.service'

@Controller('api/rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @ApiOkResponse({ type: Rule })
  @Post()
  async create(@Body() rule: RuleDTO): Promise<Rule> {
    return await this.ruleService.create(rule)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.ruleService.deleteById(+id)
  }

  @ApiOkResponse({ type: [Rule] })
  @Get()
  async get(): Promise<Rule[]> {
    return await this.ruleService.getAll()
  }

  @ApiOkResponse({ type: Rule })
  @Put(':id')
  async update(@Param('id') id: string, @Body() rule: RuleDTO): Promise<Rule> {
    return await this.ruleService.updateById(+id, rule)
  }
}
