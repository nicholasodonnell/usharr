import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { MovieDTO } from './movie.dto'
import { Movie } from './movie.model'
import { MovieService } from './movie.service'

@Controller('api/movies')
export class MovieController {
  constructor(private readonly movie: MovieService) {}

  @ApiOkResponse({ type: [Movie] })
  @Get()
  async getAll(): Promise<Movie[]> {
    return this.movie.getAll()
  }

  @ApiOkResponse({ type: [Movie] })
  @Get('deleted')
  async getDeleted(): Promise<Movie[]> {
    return this.movie.getDeleted()
  }

  @ApiOkResponse({ type: [Movie] })
  @Get('ignored')
  async getIgnored(): Promise<Movie[]> {
    return this.movie.getIgnored()
  }

  @ApiOkResponse({ type: [Movie] })
  @Get('monitored')
  async getMonitored(): Promise<Movie[]> {
    return this.movie.getMonitored()
  }

  @ApiOkResponse({ type: Movie })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() movie: MovieDTO,
  ): Promise<Movie> {
    return await this.movie.createOrUpdate({ ...movie, id: +id })
  }
}
