import type { Movie as MovieModel } from '@usharr/types'
import React from 'react'

import Movies, { Movie } from '../../components/movies'
import Section, { Title } from '../../components/section'
import { useFetch } from '../../hooks/useApi'

export default function Deleted(): JSX.Element {
  const { data: movies, loading } = useFetch<MovieModel[]>(
    '/api/movies/deleted',
  )

  return (
    <Section>
      <Title>Movies &#8212; Deleted</Title>
      <Movies loading={loading}>
        {movies?.map((movie) => <Movie key={movie.id} movie={movie} />)}
      </Movies>
    </Section>
  )
}
