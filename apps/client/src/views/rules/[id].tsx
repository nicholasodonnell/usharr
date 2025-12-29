import type { Rule as RuleModel } from '@usharr/types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Rule from '../../components/rule'
import Section, { Title } from '../../components/section'
import { deleteRule, getRule, getTags, updateRule } from '../../lib/api'

export default function EditRule(): React.ReactNode {
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const { data: rule, isLoading: loading } = useQuery<RuleModel>({
    queryFn: () => getRule(id),
    queryKey: ['rule', id],
  })
  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryFn: getTags,
    queryKey: ['tags'],
  })
  const navigate = useNavigate()

  const { mutateAsync: update } = useMutation({
    mutationFn: updateRule,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] })
    },
  })

  const { mutateAsync: destroy } = useMutation({
    mutationFn: deleteRule,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] })
    },
  })

  const handleCancel = () => {
    navigate('/rules')
  }

  const handleEdit = async (rule: RuleModel) => {
    await update(rule)
    toast.success('Rule saved')
    navigate('/rules')
  }

  const handleDelete = async (rule: RuleModel) => {
    await destroy(rule.id)
    toast.success('Rule deleted')
    navigate('/rules')
  }

  return (
    <Section>
      <Title>{rule?.name}</Title>
      <Rule
        availableTags={tags}
        loading={loading || tagsLoading}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onSubmit={handleEdit}
        values={rule}
      />
    </Section>
  )
}
