import type { Movie as MovieModel } from '@usharr/types'
import React, { useState } from 'react'

import { Input } from '../../components/form'
import Movies, { Movie } from '../../components/movies'
import Section, { Title } from '../../components/section'
import { useFetch } from '../../hooks/useApi'

export default function Deleted(): JSX.Element {
  const { data: movies, loading } = useFetch<MovieModel[]>(
    '/api/movies/deleted',
  )
  const [search, setSearch] = useState<string>('')

  return (
    <Section>
      <Title>Movies &#8212; Deleted</Title>
      <Input
        placeholder="Search"
        className="mb-4 w-full"
        onChange={setSearch}
        value={search}
      />
      <Movies loading={loading}>
        {movies
          ?.filter((movie) =>
            search
              ? movie.title.toLowerCase().includes(search.toLowerCase())
              : true,
          )
          ?.map((movie) => <Movie key={movie.id} movie={movie} />)}
      </Movies>
    </Section>
  )
}
