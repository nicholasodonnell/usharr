import type { Movie as MovieModel } from '@usharr/types'
import React, { useState } from 'react'

import MovieModal from './movieModal'

export type MoviesProps = {
  children?: React.ReactNode
  loading?: boolean
}

export type MovieProps = {
  action?: string
  movie: MovieModel
  onAction?: (movie: MovieModel) => Promise<void>
}

export function Movie({ action, movie, onAction }: MovieProps): JSX.Element {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleAction = async (movie: MovieModel) => {
    await onAction?.(movie)
    setModalOpen(false)
  }

  return (
    <div>
      <a
        className="relative block w-full cursor-pointer overflow-hidden rounded-md border border-app-background-accent bg-app-background shadow transition-all hover:scale-105 hover:shadow-lg"
        onClick={() => setModalOpen(true)}>
        <img
          className="relative z-10 aspect-[2/3] h-full w-full"
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
        />
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-center text-transparent">
          {movie.title}
        </span>
        {movie.ignored && (
          <span className="font-small absolute left-2 top-2 z-30 rounded-lg border-[1px] border-app-background-accent bg-app-background p-1 text-sm uppercase text-white shadow-lg">
            Ignored
          </span>
        )}
        {movie.daysUntilDeletion && movie.daysUntilDeletion !== null && (
          <span className="font-small absolute left-2 top-2 z-30 rounded-lg border-[1px] border-app-background-accent bg-red p-1 text-sm uppercase text-white shadow-lg">
            {movie.daysUntilDeletion} day{movie.daysUntilDeletion !== 1 && 's'}
          </span>
        )}
      </a>
      <MovieModal
        action={action}
        movie={movie}
        onAction={onAction ? handleAction : null}
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        title={movie.title}
      />
    </div>
  )
}

export function MoviesSkeleton(): JSX.Element {
  return (
    <>
      {Array.from({ length: 100 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse flex aspect-[2/3] h-full w-full flex-col items-center justify-center rounded-md border border-app-background-accent bg-app-background shadow"
        />
      ))}
    </>
  )
}

export default function Movies({
  children,
  loading = false,
}: MoviesProps): JSX.Element {
  return (
    <div className="grid grid-cols-4 gap-4 md:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-10">
      {loading && <MoviesSkeleton />}
      {!loading && children}
    </div>
  )
}
