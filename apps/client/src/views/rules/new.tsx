import type { Rule as RuleModel } from '@usharr/types'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import Rule from '../../components/rule'
import Section, { Title } from '../../components/section'
import { createRule, getTags } from '../../lib/api'

export default function CreateRule(): JSX.Element {
  const { mutateAsync: create } = useMutation(createRule)
  const { data: tags, isLoading: tagsLoading } = useQuery('tags', getTags)
  const navigate = useNavigate()

  const handleCreate = async (rule: RuleModel) => {
    await create(rule)
    toast.success('Rule created')
    navigate('/rules')
  }

  return (
    <Section>
      <Title>New rule</Title>
      <Rule
        availableTags={tags}
        loading={tagsLoading}
        onSubmit={handleCreate}
      />
    </Section>
  )
}
