import type { Rule as RuleModel, Tag } from '@usharr/types'
import React from 'react'

import Rules, { NewRule, Rule } from '../../components/rules'
import Section, { Title } from '../../components/section'
import { useCreate, useDestroy, useFetch, useMutate } from '../../hooks/useApi'
import { useToast } from '../../hooks/useToast'

export default function Index(): JSX.Element {
  const { data: rules, fetch, loading } = useFetch<RuleModel[]>('/api/rules')
  const { data: tags, loading: tagsLoading } = useFetch<Tag[]>('/api/tags')
  const { create } = useCreate<RuleModel>('/api/rules')
  const { mutate } = useMutate<RuleModel>('/api/rules/:id')
  const { destroy } = useDestroy('/api/rules/:id')
  const { addToast } = useToast()

  const handleEdit = async (rule: RuleModel) => {
    await mutate(rule.id, rule)
    addToast({ message: 'Rule saved' })

    await fetch()
  }

  const handleCreate = async (rule: RuleModel) => {
    await create(rule)
    addToast({ message: 'Rule saved' })

    await fetch()
  }

  const handleDelete = async (rule: RuleModel) => {
    await destroy(rule.id)
    addToast({ message: 'Rule deleted' })

    await fetch()
  }

  return (
    <Section>
      <Title>Rules</Title>
      <Rules loading={loading || tagsLoading}>
        {rules?.map((rule) => (
          <Rule
            availableTags={tags}
            key={rule.id}
            onDelete={handleDelete}
            onSubmit={handleEdit}
            rule={rule}
          />
        ))}
        <NewRule availableTags={tags} onSubmit={handleCreate} />
      </Rules>
    </Section>
  )
}
