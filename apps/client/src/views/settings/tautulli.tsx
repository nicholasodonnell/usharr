import type { TautulliSettings, TautulliPing } from '@usharr/types'
import React, { useState } from 'react'

import Alert from '../../components/alert'
import Button from '../../components/button'
import {
  Actions,
  Field,
  Form,
  Label,
  Input,
  Select,
} from '../../components/form'
import Section, { Title } from '../../components/section'
import { useCreate, useFetch } from '../../hooks/useApi'
import useAsyncState from '../../hooks/useAsyncState'
import { useToast } from '../../hooks/useToast'

export default function Tautulli(): JSX.Element {
  const { data: settingsData, loading: settingsLoading } =
    useFetch<TautulliSettings>('/api/settings/tautulli')
  const { data: pingData, loading: pingLoading } =
    useFetch<TautulliPing>('/api/tautulli/ping')
  const { create } = useCreate<TautulliSettings>('/api/settings/tautulli')
  const { create: postPing } = useCreate<TautulliSettings, TautulliPing>(
    '/api/tautulli/ping',
  )
  const { create: tautulliSync } = useCreate('/api/sync/tautulli')
  const [settings, setSettings] = useAsyncState<TautulliSettings>(settingsData)
  const [ping, setPing] = useAsyncState<TautulliPing>(pingData)
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false)
  const { addToast } = useToast()

  const handlePing = async () => {
    const pingResponse = await postPing(settings)
    setPing(pingResponse)

    setSaveEnabled(Boolean(pingResponse?.success))
    addToast({
      message: pingResponse?.success
        ? 'Tautulli connection established successfully'
        : 'Tautulli connection failed',
      type: pingResponse?.success ? 'info' : 'error',
    })

    if (pingResponse?.libraries?.length > 0) {
      setSettings({
        ...settings,
        tautlliLibraryId: pingResponse.libraries[0].section_id,
      })
    }
  }

  const handleSubmit = async () => {
    await create(settings)
    addToast({ message: 'Tautulli settings saved' })

    await tautulliSync()
  }

  const setProperty = (property: string) => (value: any) => {
    setSaveEnabled(false)
    setSettings({
      ...settings,
      [property]: value,
    })
  }

  return (
    <Section>
      <Title>Settings &#8212; Tautulli</Title>
      <Form onSubmit={handleSubmit}>
        {settingsData?.tautulliUrl && ping?.success === false && (
          <Alert className="mb-2" error>
            Failed to connect to Tautulli. Please check your settings and try
            again.
          </Alert>
        )}
        <Field>
          <Label className="col-span-1" required>
            Url
          </Label>
          <Input
            className="col-span-3"
            disabled={settingsLoading || pingLoading}
            onChange={setProperty('tautulliUrl')}
            placeholder="http://localhost:8181"
            required
            value={settings?.tautulliUrl}
          />
        </Field>
        <Field>
          <Label className="col-span-1" required>
            API Key
          </Label>
          <Input
            className="col-span-3"
            disabled={settingsLoading || pingLoading}
            onChange={setProperty('tautulliApiKey')}
            required
            type="password"
            value={settings?.tautulliApiKey}
          />
        </Field>
        <Field>
          <Label className="col-span-1" required>
            Library
          </Label>
          <Select<number>
            className="col-span-3"
            disabled={
              settingsLoading ||
              pingLoading ||
              !ping?.libraries ||
              ping?.libraries?.length === 0
            }
            options={ping?.libraries?.map(({ section_id, section_name }) => ({
              label: section_name,
              value: section_id,
            }))}
            onChange={setProperty('tautlliLibraryId')}
            required
            value={settings?.tautlliLibraryId}
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
            disabled={settingsLoading || pingLoading || !saveEnabled}
            type="submit">
            Save
          </Button>
        </Actions>
      </Form>
    </Section>
  )
}
