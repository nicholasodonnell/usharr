import type { Movie as MovieModel } from '@usharr/types'
import React, { useState } from 'react'

import { Input } from '../../components/form'
import Movies, { Movie } from '../../components/movies'
import Section, { Title } from '../../components/section'
import { useFetch, useMutate } from '../../hooks/useApi'
import { useToast } from '../../hooks/useToast'

export default function Monitored(): JSX.Element {
  const {
    data: movies,
    fetch,
    loading,
  } = useFetch<MovieModel[]>('/api/movies/monitored')
  const { mutate } = useMutate<MovieModel>('/api/movies/:id')
  const { addToast } = useToast()
  const [search, setSearch] = useState<string>('')

  const handleIgnore = async (movie: MovieModel) => {
    await mutate(movie.id, { ...movie, ignored: true })
    addToast({ message: 'Movie ignored' })

    await fetch()
  }

  return (
    <Section>
      <Title>Movies &#8212; Monitored</Title>
      <Input
        className="mb-4 w-full"
        onChange={setSearch}
        placeholder="Search"
        value={search}
      />
      <Movies loading={loading}>
        {movies
          ?.filter((movie) =>
            search
              ? movie.title.toLowerCase().includes(search.toLowerCase())
              : true,
          )
          ?.map((movie) => (
            <Movie
              action="Ignore"
              key={movie.id}
              movie={movie}
              onAction={handleIgnore}
            />
          ))}
      </Movies>
    </Section>
  )
}
