import React from 'react'
import { useQuery } from 'react-query'

import Rules, { NewRule, Rule } from '../../components/rules'
import Section, { Title } from '../../components/section'
import { getRules } from '../../lib/api'

export default function Index(): JSX.Element {
  const { data: rules, isLoading: rulesLoading } = useQuery('rules', getRules)

  return (
    <Section>
      <Title>Rules</Title>
      <Rules loading={rulesLoading}>
        {rules?.map((rule) => <Rule key={rule.id} rule={rule} />)}
        <NewRule />
      </Rules>
    </Section>
  )
}
