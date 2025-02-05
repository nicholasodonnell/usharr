import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import Button from '../../components/button'
import {
  Actions,
  Checkbox,
  Field,
  Form,
  Hint,
  Label,
  NumberInput,
  Select,
} from '../../components/form'
import Section, { Title } from '../../components/section'
import useApiState from '../../hooks/useAsyncState'
import { getSettings, updateSettings } from '../../lib/api'

export default function General(): JSX.Element {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery('settings/general', getSettings)

  const { mutateAsync: update } = useMutation(updateSettings, {
    onSettled: () => {
      queryClient.invalidateQueries('settings')
    },
  })

  const [settings, setSettings] = useApiState(data)

  const handleSubmit = async () => {
    await update(settings)
    toast.success('Settings saved')
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
      <Form disabled={isLoading} onSubmit={handleSubmit}>
        <Field>
          <Label className="col-span-2 md:col-span-1">Enabled</Label>
          <Checkbox
            className="col-span-2 md:col-span-3"
            disabled={isLoading}
            onChange={setProperty('enabled')}
            value={settings?.enabled}
          />
        </Field>
        <Field>
          <Label className="col-span-2 md:col-span-1">
            Sync frequency (Days)
          </Label>
          <NumberInput
            className="col-span-2 md:col-span-3"
            disabled={isLoading}
            max={365}
            min={1}
            onChange={setProperty('syncDays')}
            required
            value={settings?.syncDays}
          />
        </Field>
        <Field>
          <Label className="col-span-2 md:col-span-1">Sync Time</Label>
          <Select<number>
            className="col-span-2 md:col-span-3"
            disabled={isLoading}
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
        <Field>
          <Label className="col-span-2 md:col-span-1">
            Treat soft matches as unmonitored?
            <Hint className="mt-2">
              Soft matches are movies that match a rule but cannot be given a
              deletion date because of dynamic conditions such as watch status,
              rating, etc.
            </Hint>
          </Label>
          <Checkbox
            className="col-span-2 md:col-span-3"
            disabled={isLoading}
            onChange={setProperty('treatSoftMatchAsUnmonitored')}
            value={settings?.treatSoftMatchAsUnmonitored}
          />
        </Field>
        <Actions>
          <Button disabled={isLoading} type="submit">
            Save
          </Button>
        </Actions>
      </Form>
    </Section>
  )
}
