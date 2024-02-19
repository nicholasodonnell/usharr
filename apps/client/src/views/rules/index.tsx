import type { RuleDTO, Rule as RuleModel } from '@usharr/types'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import Rules, { NewRule, Rule } from '../../components/rules'
import Section, { Title } from '../../components/section'
import {
  createRule,
  deleteRule,
  getRules,
  getTags,
  updateRule,
} from '../../lib/api'

export default function Index(): JSX.Element {
  const queryClient = useQueryClient()

  const {
    data: rules,
    isLoading: rulesLoading,
    refetch,
  } = useQuery('rules', getRules)

  const { data: tags, isLoading: tagsLoading } = useQuery('tags', getTags)

  const { mutateAsync: create } = useMutation(createRule, {
    onSettled: () => {
      queryClient.invalidateQueries('rules')
    },
  })

  const { mutateAsync: update } = useMutation(updateRule, {
    onSettled: () => {
      queryClient.invalidateQueries('rules')
    },
  })

  const { mutateAsync: destroy } = useMutation(deleteRule, {
    onSettled: () => {
      queryClient.invalidateQueries('rules')
    },
  })

  const handleEdit = async (rule: RuleModel) => {
    await update(rule)
    toast.success('Rule saved')

    await refetch()
  }

  const handleCreate = async (rule: RuleDTO) => {
    await create(rule)
    toast.success('Rule created')

    await refetch()
  }

  const handleDelete = async (rule: RuleModel) => {
    await destroy(rule.id)
    toast.success('Rule deleted')

    await refetch()
  }

  return (
    <Section>
      <Title>Rules</Title>
      <Rules loading={rulesLoading || tagsLoading}>
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
