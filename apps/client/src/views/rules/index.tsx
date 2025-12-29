import { useQuery } from '@tanstack/react-query'
import React from 'react'

import Rules, { NewRule, Rule } from '../../components/rules'
import Section, { Title } from '../../components/section'
import { getRules } from '../../lib/api'

export default function Index(): React.ReactNode {
  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryFn: getRules,
    queryKey: ['rules'],
  })

  return (
    <Section>
      <Title>Rules</Title>
      <Rules loading={rulesLoading}>
        {rules?.map((rule) => (
          <Rule key={rule.id} rule={rule} />
        ))}
        <NewRule />
      </Rules>
    </Section>
  )
}
