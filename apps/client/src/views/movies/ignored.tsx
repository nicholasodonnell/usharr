import type { Movie as MovieModel } from '@usharr/types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { Input } from '../../components/form'
import Movies, { Movie } from '../../components/movies'
import Section, { Title } from '../../components/section'
import { getIgnoredMovies, updateMovie } from '../../lib/api'

export default function Ignored(): React.ReactNode {
  const queryClient = useQueryClient()
  const {
    data: movies,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: getIgnoredMovies,
    queryKey: ['movies', 'ignored'],
  })
  const { mutateAsync } = useMutation({
    mutationFn: updateMovie,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] })
    },
  })
  const [search, setSearch] = useState<string>('')

  const handleMonitor = async (movie: MovieModel) => {
    await mutateAsync({ ...movie, ignored: false })
    toast.success(`Monitoring ${movie.title}`)

    await refetch()
  }

  const handleIgnore = async (movie: MovieModel) => {
    await mutateAsync({ ...movie, ignored: true })
    toast.success(`Ignored ${movie.title}`)

    await refetch()
  }

  return (
    <Section>
      <Title>Ignored</Title>
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
            <Movie
              action={movie.ignored ? 'Monitor' : 'Always Ignore'}
              key={movie.id}
              movie={movie}
              onAction={movie.ignored ? handleMonitor : handleIgnore}
            />
          ))}
      </Movies>
    </Section>
  )
}
