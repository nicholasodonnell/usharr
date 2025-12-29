import type { Rule as RuleModel } from '@usharr/types'

import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import Rule from '../../components/rule'
import Section, { Title } from '../../components/section'
import { createRule, getTags } from '../../lib/api'

export default function CreateRule(): React.ReactNode {
  const { mutateAsync: create } = useMutation({
    mutationFn: createRule,
  })
  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryFn: getTags,
    queryKey: ['tags'],
  })
  const navigate = useNavigate()

  const handleCancel = () => {
    navigate('/rules')
  }

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
        onCancel={handleCancel}
        onSubmit={handleCreate}
      />
    </Section>
  )
}
