import type { GeneralSettings } from '@usharr/types'
import React from 'react'

import Button from '../../components/button'
import {
  Actions,
  Checkbox,
  Field,
  Form,
  Label,
  NumberInput,
  Select,
} from '../../components/form'
import Section, { Title } from '../../components/section'
import { useCreate, useFetch } from '../../hooks/useApi'
import useApiState from '../../hooks/useAsyncState'
import { useToast } from '../../hooks/useToast'

export default function General(): JSX.Element {
  const { data, loading } = useFetch<GeneralSettings>('/api/settings/general')
  const { create } = useCreate<GeneralSettings>('/api/settings/general')
  const [settings, setSettings] = useApiState<GeneralSettings>(data)
  const { addToast } = useToast()

  const handleSubmit = async () => {
    await create(settings)
    addToast({ message: 'Settings saved' })
  }

  const setProperty = (property: string) => (value: any) => {
    setSettings({
      ...settings,
      [property]: value,
    })
  }

  return (
    <Section>
      <Title>Settings &#8212; General</Title>
      <Form disabled={loading} onSubmit={handleSubmit}>
        <Field>
          <Label className="col-span-1">Enabled</Label>
          <Checkbox
            className="col-span-3"
            disabled={loading}
            onChange={setProperty('enabled')}
            value={settings?.enabled}
          />
        </Field>
        <Field>
          <Label className="col-span-1">Sync frequency (Days)</Label>
          <NumberInput
            className="col-span-3"
            disabled={loading}
            max={365}
            min={1}
            onChange={setProperty('syncDays')}
            required
            value={settings?.syncDays}
          />
        </Field>
        <Field>
          <Label className="col-span-1">Sync Time</Label>
          <Select<number>
            className="col-span-3"
            disabled={loading}
            onChange={setProperty('syncHour')}
            options={[
              { label: '0:00', value: 0 },
              { label: '1:00', value: 1 },
              { label: '2:00', value: 2 },
              { label: '3:00', value: 3 },
              { label: '4:00', value: 4 },
              { label: '5:00', value: 5 },
              { label: '6:00', value: 6 },
              { label: '7:00', value: 7 },
              { label: '8:00', value: 8 },
              { label: '9:00', value: 9 },
              { label: '10:00', value: 10 },
              { label: '11:00', value: 11 },
              { label: '12:00', value: 12 },
              { label: '13:00', value: 13 },
              { label: '14:00', value: 14 },
              { label: '15:00', value: 15 },
              { label: '16:00', value: 16 },
              { label: '17:00', value: 17 },
              { label: '18:00', value: 18 },
              { label: '19:00', value: 19 },
              { label: '20:00', value: 20 },
              { label: '21:00', value: 21 },
              { label: '22:00', value: 22 },
              { label: '23:00', value: 23 },
            ]}
            required
            value={settings?.syncHour}
          />
        </Field>
        <Actions>
          <Button disabled={loading} type="submit">
            Save
          </Button>
        </Actions>
      </Form>
    </Section>
  )
}
