import type { Rule as RuleModel, Tag } from '@usharr/types'
import React, { useState } from 'react'

import Button from './button'
import {
  Actions,
  Checkbox,
  Field,
  Form,
  Input,
  Label,
  MultipleSelect,
  NumberInput,
  Select,
} from './form'

export type RuleProps = {
  availableTags: Tag[]
  loading?: boolean
  onCancel?: () => void
  onDelete?: (rule: RuleModel) => Promise<void>
  onSubmit: (rule: RuleModel) => Promise<void>
  values?: RuleModel
}

export type RuleFormProps = Omit<RuleProps, 'loading' | 'title'>

const defaultRule: Partial<RuleModel> = {
  enabled: false,
}

export function RuleForm({
  availableTags = [],
  onCancel,
  onDelete,
  onSubmit,
  values,
}: RuleFormProps): JSX.Element {
  const [rule, setRule] = useState<RuleModel>(
    values || (defaultRule as RuleModel),
  )

  const setProperty = (property: string) => (value: any) => {
    setRule({
      ...rule,
      [property]: value,
    })
  }

  const handleCancel = async () => {
    onCancel?.()
  }

  const handleSubmit = async () => {
    await onSubmit(rule)
  }

  const handleDelete = async () => {
    await onDelete?.(rule)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <Label className="col-span-1" required>
          Name
        </Label>
        <Input
          className="col-span-3"
          onChange={setProperty('name')}
          required
          value={rule?.name}
        />
      </Field>
      <Field>
        <Label className="col-span-1">Enabled</Label>
        <Checkbox
          className="col-span-3"
          onChange={setProperty('enabled')}
          value={rule?.enabled}
        />
      </Field>
      <Field>
        <Label className="col-span-1">Download Age (Days)</Label>
        <NumberInput
          className="col-span-3"
          min={1}
          onChange={setProperty('downloadedDaysAgo')}
          value={rule?.downloadedDaysAgo}
        />
      </Field>
      <Field>
        <Label className="col-span-1">Watched</Label>
        <Select<boolean>
          className="col-span-3"
          onChange={setProperty('watched')}
          options={[
            { label: '', value: null },
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]}
          value={rule?.watched}
        />
      </Field>
      <Field>
        <Label className="col-span-1">Last Watched (Days)</Label>
        <NumberInput
          className="col-span-3"
          disabled={!rule?.watched}
          min={1}
          onChange={setProperty('watchedDaysAgo')}
          value={rule?.watched ? rule?.watchedDaysAgo : null}
        />
      </Field>
      <Field>
        <Label className="col-span-1">In Radarr List</Label>
        <Select<boolean>
          className="col-span-3"
          onChange={setProperty('appearsInList')}
          options={[
            { label: '', value: null },
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]}
          value={rule?.appearsInList}
        />
      </Field>
      <Field>
        <Label className="col-span-1">IMDB Rating less than (%)</Label>
        <NumberInput
          className="col-span-3"
          max={100}
          min={1}
          onChange={setProperty('minimumImdbRating')}
          value={rule?.minimumImdbRating}
        />
      </Field>
      <Field>
        <Label className="col-span-1">TMDB Rating less than (%)</Label>
        <NumberInput
          className="col-span-3"
          max={100}
          min={1}
          onChange={setProperty('minimumTmdbRating')}
          value={rule?.minimumTmdbRating}
        />
      </Field>
      <Field>
        <Label className="col-span-1">Metacritic Rating less than (%)</Label>
        <NumberInput
          className="col-span-3"
          max={100}
          min={1}
          onChange={setProperty('minimumMetacriticRating')}
          value={rule?.minimumMetacriticRating}
        />
      </Field>
      <Field>
        <Label className="col-span-1">
          Rotten Tomatoes Rating less than (%)
        </Label>
        <NumberInput
          className="col-span-3"
          max={100}
          min={1}
          onChange={setProperty('minimumRottenTomatoesRating')}
          value={rule?.minimumRottenTomatoesRating}
        />
      </Field>
      <Field>
        <Label className="col-span-1">Radarr Tags</Label>
        <MultipleSelect<null | number>
          className="col-span-3"
          onChange={(ids) =>
            setProperty('tags')(
              availableTags.filter((tag) => ids.includes(tag.id)),
            )
          }
          options={availableTags.map((tag: Tag) => ({
            label: tag.name,
            value: tag.id,
          }))}
          values={rule?.tags?.map((tag: Tag) => tag.id) || []}
        />
      </Field>
      <Actions>
        {onCancel && (
          <Button onClick={handleCancel} secondary>
            Cancel
          </Button>
        )}
        {onDelete && (
          <Button onClick={handleDelete} warning>
            Delete
          </Button>
        )}
        <Button type="submit">Save</Button>
      </Actions>
    </Form>
  )
}

export default function Rule({
  availableTags = [],
  loading,
  onCancel,
  onDelete,
  onSubmit,
  values,
}: RuleProps) {
  if (loading) {
    return
  }

  return (
    <RuleForm
      availableTags={availableTags}
      onCancel={onCancel}
      onDelete={onDelete}
      onSubmit={onSubmit}
      values={values}
    />
  )
}
