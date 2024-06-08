import type { Movie as MovieModel } from '@usharr/types'
import cx from 'classnames'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import { Input } from '../../components/form'
import Movies, { Movie } from '../../components/movies'
import Section, { Title } from '../../components/section'
import { H4 } from '../../components/text'
import { getMonitoredMovies, updateMovie } from '../../lib/api'

export default function Monitored(): JSX.Element {
  const queryClient = useQueryClient()
  const {
    data: movies,
    isLoading,
    refetch,
  } = useQuery('movies/monitored', getMonitoredMovies)
  const { mutateAsync } = useMutation(updateMovie, {
    onSettled: () => {
      queryClient.invalidateQueries('movies')
    },
  })
  const [search, setSearch] = useState<string>('')

  const handleIgnore = async (movie: MovieModel) => {
    await mutateAsync({ ...movie, ignored: true })
    toast.success(`Ignored ${movie.title}`)

    await refetch()
  }

  const moviesByMatchedRule = movies?.reduce<Record<string, MovieModel[]>>(
    (acc, movie) => ({
      ...acc,
      [movie.matchedRule.name]: [...(acc[movie.matchedRule.name] || []), movie],
    }),
    {},
  )

  return (
    <Section>
      <Title>Monitored</Title>
      <Input
        className="mb-4 w-full"
        onChange={setSearch}
        placeholder="Search"
        value={search}
      />
      <div className="flex flex-col gap-12">
        {Object.entries(moviesByMatchedRule || {}).map(([ruleName, movies]) => (
          <div key={ruleName}>
            <H4 className="mb-4">{ruleName}</H4>
            <Movies loading={isLoading}>
              {movies
                ?.filter((movie) =>
                  search
                    ? movie.title.toLowerCase().includes(search.toLowerCase())
                    : true,
                )
                ?.map((movie) => (
                  <Movie
                    action="Ignore"
                    className={cx({
                      'opacity-30': movie.daysUntilDeletion === null,
                    })}
                    key={movie.id}
                    movie={movie}
                    onAction={handleIgnore}
                  />
                ))}
            </Movies>
          </div>
        ))}
      </div>
    </Section>
  )
}
