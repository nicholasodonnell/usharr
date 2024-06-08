import { Movie } from '@usharr/types'
import React from 'react'

import Alert from './alert'
import Button from './button'
import { Actions, Form } from './form'
import { External } from './icon'
import Modal from './modal'
import Section, { Title } from './section'
import { P } from './text'

export type MovieModalProps = {
  action?: string
  movie?: Movie
  onAction?: (movie: Movie) => Promise<void>
  onClose: () => void
  open: boolean
  title: string
}

export default function MovieModal({
  action,
  movie,
  onAction,
  onClose,
  open,
  title,
}: MovieModalProps): JSX.Element {
  const handleAction = async () => {
    await onAction?.(movie)
  }

  return (
    <Modal onClose={onClose} open={open}>
      <Section>
        <Title className="flex flex-row items-center">
          {title}
          <a
            className="ml-auto"
            href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
            rel="noreferrer"
            target="_blank">
            <External className="h-6 w-6" />
          </a>
        </Title>
        <Form>
          {movie?.deleted && (
            <Alert className="mb-2" error>
              Deleted {new Date(movie.deletedAt).toLocaleDateString()}
            </Alert>
          )}
          <div className="flex w-full flex-1 flex-row">
            <div className="mr-8 w-1/4">
              <img
                alt={movie.title}
                className="aspect-[2/3] rounded-md border border-app-background-accent shadow"
                src={movie.poster}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-2 gap-4">
                <P bold>Watched</P>
                <P className="break-words">{movie.watched ? 'Yes' : 'No'}</P>
              </div>
              {movie.lastWatchedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <P bold>Last Watched</P>
                  <P className="break-words">
                    {new Date(movie.lastWatchedAt).toLocaleDateString()}
                  </P>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <P bold>Downloaded</P>
                <P className="break-words">
                  {new Date(movie.downloadedAt).toLocaleDateString()}
                </P>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <P bold>Appears in List</P>
                <P className="break-words">
                  {movie.appearsInList ? 'Yes' : 'No'}
                </P>
              </div>
              {movie.imdbRating && (
                <div className="grid grid-cols-2 gap-4">
                  <P bold>IMDB Rating</P>
                  <P>{movie.imdbRating}%</P>
                </div>
              )}
              {movie.tmdbRating && (
                <div className="grid grid-cols-2 gap-4">
                  <P bold>TMDB Rating</P>
                  <P className="break-words">{movie.tmdbRating}%</P>
                </div>
              )}
              {movie.metacriticRating && (
                <div className="grid grid-cols-2 gap-4">
                  <P bold>Metacritic Rating</P>
                  <P className="break-words">{movie.metacriticRating}%</P>
                </div>
              )}
              {movie.rottenTomatoesRating && (
                <div className="grid grid-cols-2 gap-4">
                  <P bold>Rotten Tomatoes Rating</P>
                  <P className="break-words">{movie.rottenTomatoesRating}%</P>
                </div>
              )}
              {movie.tags?.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <P bold>Tags</P>
                  <P className="break-words">
                    {movie.tags.map((tag) => tag.name).join(', ')}
                  </P>
                </div>
              )}
              {movie.matchedRule && (
                <div className="grid grid-cols-2 gap-4">
                  <P bold>Matched Rule</P>
                  <P className="break-words">{movie.matchedRule.name}</P>
                </div>
              )}
              {!!movie.daysUntilDeletion &&
                movie.daysUntilDeletion !== null && (
                  <div className="grid grid-cols-2 gap-4">
                    <P bold>Days Remaining</P>
                    <P bold className="break-words text-red">
                      {movie.daysUntilDeletion} days
                    </P>
                  </div>
                )}
            </div>
          </div>
          <Actions>
            <Button onClick={onClose} secondary>
              Cancel
            </Button>
            {onAction && <Button onClick={handleAction}>{action}</Button>}
          </Actions>
        </Form>
      </Section>
    </Modal>
  )
}
