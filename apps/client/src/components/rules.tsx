import type { Rule as RuleModel, Tag } from '@usharr/types'
import cx from 'classnames'
import React, { useState } from 'react'

import { Plus } from './icon'
import RuleModal from './ruleModal'
import { H3, H4, P } from './text'

export type RulesProps = {
  children?: React.ReactNode
  loading?: boolean
}

export type RuleProps = {
  availableTags: Tag[]
  onSubmit: (RuleModel) => Promise<void>
  onDelete: (RuleModel) => Promise<void>
  rule: RuleModel
}

export type NewRuleProps = {
  onSubmit: (RuleModel) => Promise<void>
  availableTags: Tag[]
}

export function NewRule({
  availableTags,
  onSubmit,
}: NewRuleProps): JSX.Element {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleSubmit = async (rule: RuleModel) => {
    await onSubmit(rule)
    setModalOpen(false)
  }

  return (
    <div>
      <a
        className="flex-center bg-app-background border-app-background-accent flex h-80 w-full cursor-pointer rounded-md border-[1px] border-dashed shadow transition-all hover:border-solid hover:shadow-lg"
        onClick={() => setModalOpen(true)}>
        <div className="flex-1 flex flex-row justify-center self-center">
          <Plus className="mr-2 h-8 w-8" />
          <H4 className="leading-[32px]">New Rule</H4>
        </div>
      </a>
      <RuleModal
        availableTags={availableTags}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        open={modalOpen}
        title="New Rule"
      />
    </div>
  )
}

export function Rule({
  availableTags,
  onSubmit,
  onDelete,
  rule,
}: RuleProps): JSX.Element {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleSubmit = async (rule: RuleModel) => {
    await onSubmit(rule)
    setModalOpen(false)
  }

  const handleDelete = async (rule: RuleModel) => {
    await onDelete(rule)
    setModalOpen(false)
  }

  return (
    <div>
      <a
        className={cx(
          'bg-app-background border-app-background-accent flex h-80 w-full cursor-pointer items-baseline overflow-hidden rounded-md border-[1px] shadow transition-all hover:border-solid hover:shadow-lg',
          {
            'opacity-50': !rule.enabled,
          },
        )}
        onClick={() => setModalOpen(true)}>
        <div className="flex w-full flex-1 flex-col p-8">
          <H3 className="mb-4 truncate">{rule.name}</H3>
          <div>
            {rule.downloadedDaysAgo && (
              <div className="grid grid-cols-4">
                <P className="col-span-3" bold>
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
                <P className="col-span-3" bold>
                  Watched
                </P>
                <P className="truncate">{rule.watched ? 'Yes' : 'No'}</P>
              </div>
            )}
            {rule.watchedDaysAgo && (
              <div className="grid grid-cols-4">
                <P className="col-span-3" bold>
                  Last Watched
                </P>
                <P className="truncate">
                  {rule.watchedDaysAgo} day
                  {rule.watchedDaysAgo !== 1 ? 's' : ''} ago
                </P>
              </div>
            )}
            {rule.minimumImdbRating && (
              <div className="grid grid-cols-4">
                <P className="col-span-3" bold>
                  IMDB Rating Less Than
                </P>
                <P className="truncate">{rule.minimumImdbRating}%</P>
              </div>
            )}
            {rule.minimumTmdbRating && (
              <div className="grid grid-cols-4">
                <P className="col-span-3" bold>
                  TMDB Rating Less Than
                </P>
                <P className="truncate">{rule.minimumTmdbRating}%</P>
              </div>
            )}
            {rule.minimumMetacriticRating && (
              <div className="grid grid-cols-4">
                <P className="col-span-3" bold>
                  Metacritic Rating Less Than
                </P>
                <P className="truncate">{rule.minimumMetacriticRating}%</P>
              </div>
            )}
            {rule.minimumRottenTomatoesRating && (
              <div className="grid grid-cols-4">
                <P className="col-span-3" bold>
                  Rotten Tomatoes Rating Less Than
                </P>
                <P className="truncate">{rule.minimumRottenTomatoesRating}%</P>
              </div>
            )}
            {rule.tags?.length > 0 && (
              <div className="grid grid-cols-4">
                <P className="col-span-3" bold>
                  Tags
                </P>
                <P className="truncate">
                  {rule.tags.map((tag) => tag.name).join(', ')}
                </P>
              </div>
            )}
          </div>
        </div>
      </a>
      <RuleModal
        availableTags={availableTags}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        open={modalOpen}
        title="Edit Rule"
        values={rule}
      />
    </div>
  )
}

export function RulesSkeleton(): JSX.Element {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-app-background flex h-80 w-full animate-pulse flex-col items-center justify-center rounded-md shadow"
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
