import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { Movie } from '@usharr/types'

import { MovieService } from './movie.service'

@Controller('api/movies')
export class MovieController {
  constructor(private readonly movie: MovieService) {}

  @Get()
  async getAll(): Promise<Movie[]> {
    return this.movie.getAll()
  }

  @Get('monitored')
  async getMonitored(): Promise<Movie[]> {
    return this.movie.getMonitored()
  }

  @Get('ignored')
  async getIgnored(): Promise<Movie[]> {
    return this.movie.getIgnored()
  }

  @Get('deleted')
  async getDeleted(): Promise<Movie[]> {
    return this.movie.getDeleted()
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() movie: Movie): Promise<Movie> {
    return await this.movie.createOrUpdate({ ...movie, id: +id })
  }
}
