import type { Rule as RuleModel } from '@usharr/types'
import cx from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'

import { Plus } from './icon'
import { H3, H4, P } from './text'

export type RulesProps = {
  children?: React.ReactNode
  loading?: boolean
}

export type RuleProps = {
  rule: RuleModel
}

export function NewRule(): JSX.Element {
  return (
    <div>
      <Link
        className="flex-center flex h-80 w-full cursor-pointer rounded-md border-[1px] border-dashed border-app-background-accent bg-app-background shadow transition-all hover:border-solid hover:shadow-lg"
        to="/rules/new">
        <div className="flex flex-1 flex-row justify-center self-center">
          <Plus className="mr-2 h-8 w-8" />
          <H4 className="leading-[32px]">New Rule</H4>
        </div>
      </Link>
    </div>
  )
}

export function Rule({ rule }: RuleProps): JSX.Element {
  return (
    <div>
      <Link
        className={cx(
          'flex h-80 w-full cursor-pointer items-baseline overflow-hidden rounded-md border-[1px] border-app-background-accent bg-app-background shadow transition-all hover:border-solid hover:shadow-lg',
          {
            'opacity-50': !rule.enabled,
          },
        )}
        to={`/rules/${rule.id}`}>
        <div className="flex w-full flex-1 flex-col p-8">
          <H3 className="mb-4 truncate">{rule.name}</H3>
          <div>
            {rule.downloadedDaysAgo && (
              <div className="grid grid-cols-4">
                <P bold className="col-span-3">
                  Download Age
                </P>
                <P className="truncate">
                  {rule.downloadedDaysAgo} day
                  {rule.downloadedDaysAgo !== 1 ? 's' : ''}
                </P>
              </div>
            )}
            {rule.watched !== null && (
              <div className="grid grid-cols-4">
                <P bold className="col-span-3">
                  Watched
                </P>
                <P className="truncate">{rule.watched ? 'Yes' : 'No'}</P>
              </div>
            )}
            {rule.watchedDaysAgo && (
              <div className="grid grid-cols-4">
                <P bold className="col-span-3">
                  Last Watched
                </P>
                <P className="truncate">
                  {rule.watchedDaysAgo} day
                  {rule.watchedDaysAgo !== 1 ? 's' : ''} ago
                </P>
              </div>
            )}
            {rule.appearsInList !== null && (
              <div className="grid grid-cols-4">
                <P bold className="col-span-3">
                  In Lists
                </P>
                <P className="truncate">
                  <P className="truncate">
                    {rule.appearsInList ? 'Yes' : 'No'}
                  </P>
                </P>
              </div>
            )}
            {rule.minimumImdbRating && (
              <div className="grid grid-cols-4">
                <P bold className="col-span-3">
                  IMDB Rating Less Than
                </P>
                <P className="truncate">{rule.minimumImdbRating}%</P>
              </div>
            )}
            {rule.minimumTmdbRating && (
              <div className="grid grid-cols-4">
                <P bold className="col-span-3">
                  TMDB Rating Less Than
                </P>
                <P className="truncate">{rule.minimumTmdbRating}%</P>
              </div>
            )}
            {rule.minimumMetacriticRating && (
              <div className="grid grid-cols-4">
                <P bold className="col-span-3">
                  Metacritic Rating Less Than
                </P>
                <P className="truncate">{rule.minimumMetacriticRating}%</P>
              </div>
            )}
            {rule.minimumRottenTomatoesRating && (
              <div className="grid grid-cols-4">
                <P bold className="col-span-3">
                  Rotten Tomatoes Rating Less Than
                </P>
                <P className="truncate">{rule.minimumRottenTomatoesRating}%</P>
              </div>
            )}
            {rule.tags?.length > 0 && (
              <div className="grid grid-cols-4">
                <P bold className="col-span-3">
                  Tags
                </P>
                <P className="truncate">
                  {rule.tags.map((tag) => tag.name).join(', ')}
                </P>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export function RulesSkeleton(): JSX.Element {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="flex h-80 w-full animate-pulse flex-col items-center justify-center rounded-md bg-app-background shadow"
          key={index}
        />
      ))}
    </>
  )
}

export default function Rules({
  children,
  loading = false,
}: RulesProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {loading && <RulesSkeleton />}
      {!loading && children}
    </div>
  )
}
