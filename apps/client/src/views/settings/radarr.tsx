import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import Alert from '../../components/alert'
import Button from '../../components/button'
import {
  Actions,
  Checkbox,
  Field,
  Form,
  Input,
  Label,
} from '../../components/form'
import Section, { Title } from '../../components/section'
import useAsyncState from '../../hooks/useAsyncState'
import {
  getRadarrSettings,
  pingRadarr,
  postPingRadarr,
  syncRadarr,
  updateRadarrSettings,
} from '../../lib/api'

export default function Radarr(): JSX.Element {
  const queryClient = useQueryClient()

  const { data: settingsData, isLoading: settingsLoading } = useQuery(
    'settings/radarr',
    getRadarrSettings,
  )

  const { data: pingData, isLoading: pingLoading } = useQuery(
    'radarr/ping',
    pingRadarr,
  )

  const { mutateAsync: postPing } = useMutation(postPingRadarr)

  const { mutateAsync: update } = useMutation(updateRadarrSettings, {
    onSettled: () => {
      queryClient.invalidateQueries('settings/radarr')
    },
  })

  const { mutateAsync: radarrSync } = useMutation(syncRadarr)

  const [settings, setSettings] = useAsyncState(settingsData)
  const [ping, setPing] = useAsyncState(pingData)

  const handlePing = async () => {
    const pingResponse = await postPing(settings)
    setPing(pingResponse)

    if (pingResponse?.success) {
      return toast.success('Radarr connection established successfully')
    }

    return toast.error('Radarr connection failed')
  }

  const handleSubmit = async () => {
    await update(settings)
    toast.success('Radarr settings saved')

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
        <Field>
          <Label className="col-span-1">
            Exclude movies from list imports when deleted?
          </Label>
          <Checkbox
            className="col-span-3"
            disabled={settingsLoading || pingLoading}
            onChange={setProperty('radarrAddImportListExclusion')}
            value={settings?.radarrAddImportListExclusion}
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
