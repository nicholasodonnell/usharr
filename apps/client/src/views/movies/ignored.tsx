import type { Movie as MovieModel } from '@usharr/types'
import React, { useState } from 'react'

import { Input } from '../../components/form'
import Movies, { Movie } from '../../components/movies'
import Section, { Title } from '../../components/section'
import { useFetch, useMutate } from '../../hooks/useApi'
import { useToast } from '../../hooks/useToast'

export default function Ignored(): JSX.Element {
  const {
    fetch,
    data: movies,
    loading,
  } = useFetch<MovieModel[]>('/api/movies/ignored')
  const { mutate } = useMutate<MovieModel>('/api/movies/:id')
  const { addToast } = useToast()
  const [search, setSearch] = useState<string>('')

  const handleMonitor = async (movie: MovieModel) => {
    await mutate(movie.id, { ...movie, ignored: false })
    addToast({ message: 'Movie monitored' })

    await fetch()
  }

  const handleIgnore = async (movie: MovieModel) => {
    await mutate(movie.id, { ...movie, ignored: true })
    addToast({ message: 'Movie ignored' })

    await fetch()
  }

  return (
    <Section>
      <Title>Movies &#8212; Ignored</Title>
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
          ?.map((movie) => (
            <Movie
              key={movie.id}
              action={movie.ignored ? 'Monitor' : 'Always Ignore'}
              onAction={movie.ignored ? handleMonitor : handleIgnore}
              movie={movie}
            />
          ))}
      </Movies>
    </Section>
  )
}
