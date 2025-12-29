import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

import { Input } from '../../components/form'
import Movies, { Movie } from '../../components/movies'
import Section, { Title } from '../../components/section'
import { getDeletedMovies } from '../../lib/api'

export default function Deleted(): React.ReactNode {
  const { data: movies, isLoading } = useQuery({
    queryFn: getDeletedMovies,
    queryKey: ['movies', 'deleted'],
  })
  const [search, setSearch] = useState<string>('')

  return (
    <Section>
      <Title>Deleted</Title>
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
          ?.map((movie) => (
            <Movie key={movie.id} movie={movie} />
          ))}
      </Movies>
    </Section>
  )
}
