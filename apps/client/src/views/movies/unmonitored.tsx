import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { Input } from '../../components/form'
import Movies, { Movie } from '../../components/movies'
import Section, { Title } from '../../components/section'
import { getUnmonitoredMovies } from '../../lib/api'

export default function Unmonitored(): JSX.Element {
  const { data: movies, isLoading } = useQuery(
    'movies/unmonitored',
    getUnmonitoredMovies,
  )
  const [search, setSearch] = useState<string>('')

  return (
    <Section>
      <Title>Unmonitored</Title>
      <Input
        className="mb-4 w-full"
        onChange={setSearch}
        placeholder="Search"
        value={search}
      />
      <Movies loading={isLoading}>
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
