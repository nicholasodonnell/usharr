import { Body, Controller, Get, Param, Put } from '@nestjs/common'

import { MovieDTO } from './movie.dto'
import { Movie } from './movie.model'
import { MovieService } from './movie.service'

@Controller('api/movies')
export class MovieController {
  constructor(private readonly movie: MovieService) {}

  @Get()
  async getAll(): Promise<Movie[]> {
    return this.movie.getAll()
  }

  @Get('deleted')
  async getDeleted(): Promise<Movie[]> {
    return this.movie.getDeleted()
  }

  @Get('ignored')
  async getIgnored(): Promise<Movie[]> {
    return this.movie.getIgnored()
  }

  @Get('monitored')
  async getMonitored(): Promise<Movie[]> {
    return this.movie.getMonitored()
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() movie: MovieDTO,
  ): Promise<Movie> {
    return await this.movie.createOrUpdate({ ...movie, id: +id })
  }
}
