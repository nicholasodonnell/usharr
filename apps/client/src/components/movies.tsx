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
        className="bg-app-background border-app-background-accent relative block w-full cursor-pointer overflow-hidden rounded-md border shadow transition-all hover:scale-105 hover:shadow-lg"
        onClick={() => setModalOpen(true)}>
        <img
          className="aspect-[2/3] w-full h-full"
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
        />
        {movie.ignored && (
          <span className="bg-app-background font-small border-app-background-accent absolute left-2 top-2 rounded-lg border-[1px] p-1 text-white shadow-lg uppercase">
            Ignored
          </span>
        )}
        {movie.daysUntilDeletion && (
          <span className="bg-red font-small border-app-background-accent absolute left-2 top-2 rounded-lg border-[1px] p-1 text-white shadow-lg uppercase">
            {movie.daysUntilDeletion} days
          </span>
        )}
      </a>
      <MovieModal
        action={action}
        movie={movie}
        onClose={() => setModalOpen(false)}
        onAction={onAction ? handleAction : null}
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
          className="bg-app-background border-app-background-accent flex aspect-[2/3] h-full w-full animate-pulse flex-col items-center justify-center rounded-md border shadow"
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
