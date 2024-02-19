import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import Alert from '../../components/alert'
import Button from '../../components/button'
import { Actions, Field, Form, Input, Label } from '../../components/form'
import Section, { Title } from '../../components/section'
import useAsyncState from '../../hooks/useAsyncState'
import {
  getTautulliSettings,
  pingTautulli,
  postPingTautulli,
  syncTautulli,
  updateTautulliSettings,
} from '../../lib/api'

export default function Tautulli(): JSX.Element {
  const queryClient = useQueryClient()

  const { data: settingsData, isLoading: settingsLoading } = useQuery(
    'settings/tautulli',
    getTautulliSettings,
  )

  const { data: pingData, isLoading: pingLoading } = useQuery(
    'tautulli/ping',
    pingTautulli,
  )

  const { mutateAsync: postPing } = useMutation(postPingTautulli)

  const { mutateAsync: update } = useMutation(updateTautulliSettings, {
    onSettled: () => {
      queryClient.invalidateQueries('settings/tautulli')
    },
  })

  const { mutateAsync: tautulliSync } = useMutation(syncTautulli)

  const [settings, setSettings] = useAsyncState(settingsData)
  const [ping, setPing] = useAsyncState(pingData)

  const handlePing = async () => {
    const pingResponse = await postPing(settings)
    setPing(pingResponse)

    if (pingResponse?.success) {
      return toast.success('Tautulli connection established successfully')
    }

    return toast.error('Tautulli connection failed')
  }

  const handleSubmit = async () => {
    await update(settings)
    toast.success('Tautulli settings saved')

    await tautulliSync()
  }

  const setProperty = (property: string) => (value: any) => {
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
              !settings?.tautulliUrl ||
              !settings?.tautulliApiKey
            }
            type="submit">
            Save
          </Button>
        </Actions>
      </Form>
    </Section>
  )
}
