import type {
  RadarrPing,
  RadarrSettings,
  RadarrSettingsDTO,
} from '@usharr/types'
import React from 'react'

import Alert from '../../components/alert'
import Button from '../../components/button'
import { Actions, Field, Form, Input, Label } from '../../components/form'
import Section, { Title } from '../../components/section'
import { useCreate, useFetch } from '../../hooks/useApi'
import useAsyncState from '../../hooks/useAsyncState'
import { useToast } from '../../hooks/useToast'

export default function Radarr(): JSX.Element {
  const { data: settingsData, loading: settingsLoading } =
    useFetch<RadarrSettings>('/api/settings/radarr')
  const { data: pingData, loading: pingLoading } =
    useFetch<RadarrPing>('/api/radarr/ping')
  const { create } = useCreate<RadarrSettingsDTO>('/api/settings/radarr')
  const { create: postPing } = useCreate<RadarrSettingsDTO, RadarrPing>(
    '/api/radarr/ping',
  )
  const { create: radarrSync } = useCreate('/api/sync/radarr')
  const [settings, setSettings] = useAsyncState<RadarrSettings>(settingsData)
  const [ping, setPing] = useAsyncState<RadarrPing>(pingData)
  const { addToast } = useToast()

  const handlePing = async () => {
    const pingResponse = await postPing(settings)
    setPing(pingResponse)

    addToast({
      message: pingResponse?.success
        ? 'Radarr connection established successfully'
        : 'Radarr connection failed',
      type: pingResponse?.success ? 'info' : 'error',
    })
  }

  const handleSubmit = async () => {
    await create(settings)
    addToast({ message: 'Radarr settings saved' })

    await radarrSync()
  }

  const setProperty = (property: string) => (value: any) => {
    setSettings({
      ...settings,
      [property]: value,
    })
  }

  return (
    <Section>
      <Title>Settings &#8212; Radarr</Title>
      <Form onSubmit={handleSubmit}>
        {settingsData?.radarrUrl && ping?.success === false && (
          <Alert className="mb-2" error>
            Failed to connect to Radarr. Please check your settings and try
            again.
          </Alert>
        )}
        {ping?.success && ping?.hasRecycleBin === false && (
          <Alert className="mb-2" warning>
            Radarr's recycling bin is disabled. Please consider{' '}
            <a
              className="border-b border-dashed"
              href="https://wiki.servarr.com/radarr/settings#file-management"
              rel="noreferrer"
              target="_blank">
              enabling it
            </a>{' '}
            to prevent unintentional data loss.
          </Alert>
        )}
        <Field>
          <Label className="col-span-1" required>
            Url
          </Label>
          <Input
            className="col-span-3"
            disabled={settingsLoading || pingLoading}
            onChange={setProperty('radarrUrl')}
            placeholder="http://localhost:7878"
            required
            value={settings?.radarrUrl}
          />
        </Field>
        <Field>
          <Label className="col-span-1" required>
            API Key
          </Label>
          <Input
            className="col-span-3"
            disabled={settingsLoading || pingLoading}
            onChange={setProperty('radarrApiKey')}
            required
            type="password"
            value={settings?.radarrApiKey}
          />
        </Field>
        <Actions>
          <Button
            disabled={settingsLoading || pingLoading}
            onClick={handlePing}
            secondary>
            Test
          </Button>
          <Button
            disabled={
              settingsLoading ||
              pingLoading ||
              !settings?.radarrUrl ||
              !settings?.radarrApiKey
            }
            type="submit">
            Save
          </Button>
        </Actions>
      </Form>
    </Section>
  )
}
