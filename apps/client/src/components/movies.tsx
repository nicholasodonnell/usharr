import type { Movie as MovieModel } from '@usharr/types'
import cx from 'classnames'
import React, { useState } from 'react'

import MovieModal from './movieModal'

export type MoviesProps = {
  children?: React.ReactNode
  loading?: boolean
}

export type MovieProps = {
  action?: string
  className?: string
  movie: MovieModel
  onAction?: (movie: MovieModel) => Promise<void>
}

export function Movie({
  action,
  className,
  movie,
  onAction,
}: MovieProps): JSX.Element {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleAction = async (movie: MovieModel) => {
    await onAction?.(movie)
    setModalOpen(false)
  }

  return (
    <div>
      <a
        className={cx(
          'relative block w-full cursor-pointer overflow-hidden rounded-md border border-app-background-accent bg-app-background shadow transition-all hover:scale-105 hover:shadow-lg',
          className,
        )}
        onClick={() => setModalOpen(true)}>
        <img
          alt={movie.title}
          className="relative z-10 aspect-[2/3] h-full w-full"
          loading="lazy"
          src={movie.poster}
        />
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-center text-transparent">
          {movie.title}
        </span>
        {movie.ignored && (
          <span className="font-small absolute left-2 top-2 z-30 rounded-lg border-[1px] border-app-background-accent bg-app-background p-1 text-sm uppercase text-white shadow-lg">
            Ignored
          </span>
        )}
        {movie.daysUntilDeletion !== null &&
          movie.daysUntilDeletion !== undefined && (
            <span className="font-small absolute left-2 top-2 z-30 rounded-lg border-[1px] border-app-background-accent bg-red p-1 text-sm uppercase text-white opacity-90 shadow-lg">
              {movie.daysUntilDeletion > 0 ? (
                <>
                  {movie.daysUntilDeletion} day
                  {movie.daysUntilDeletion !== 1 && 's'}
                </>
              ) : (
                'Next Sync'
              )}
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
          className="flex aspect-[2/3] h-full w-full animate-pulse flex-col items-center justify-center rounded-md border border-app-background-accent bg-app-background shadow"
          key={index}
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
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-10">
      {loading && <MoviesSkeleton />}
      {!loading && children}
    </div>
  )
}
