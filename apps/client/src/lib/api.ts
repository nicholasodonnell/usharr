import type {
  GeneralSettings,
  GeneralSettingsDTO,
  Movie,
  MovieDTO,
  RadarrPing,
  RadarrSettings,
  RadarrSettingsDTO,
  Rule,
  RuleDTO,
  Tag,
  TautulliPing,
  TautulliSettings,
  TautulliSettingsDTO,
} from '@usharr/types'

import request from './request'

export const getMonitoredMovies = () =>
  request<Movie[]>({
    method: 'GET',
    url: '/api/movies/monitored',
  })

export const getUnmonitoredMovies = () =>
  request<Movie[]>({
    method: 'GET',
    url: '/api/movies/unmonitored',
  })

export const getDeletedMovies = () =>
  request<Movie[]>({
    method: 'GET',
    url: '/api/movies/deleted',
  })

export const getIgnoredMovies = () =>
  request<Movie[]>({
    method: 'GET',
    url: '/api/movies/ignored',
  })

export const updateMovie = (movie: MovieDTO) =>
  request<MovieDTO, Movie>({
    data: movie,
    method: 'PUT',
    url: `/api/movies/${movie.id}`,
  })

export const getRules = () =>
  request<Rule[]>({
    method: 'GET',
    url: '/api/rules',
  })

export const getRule = (id) =>
  request<Rule>({
    method: 'GET',
    url: `/api/rules/${id}`,
  })

export const updateRule = (rule: RuleDTO & { id: number }) =>
  request<RuleDTO, Rule>({
    data: rule,
    method: 'PUT',
    url: `/api/rules/${rule.id}`,
  })

export const createRule = (rule: RuleDTO) =>
  request<RuleDTO, Rule>({
    data: rule,
    method: 'POST',
    url: '/api/rules',
  })

export const deleteRule = (id: number) =>
  request<void, void>({
    method: 'DELETE',
    url: `/api/rules/${id}`,
  })

export const getTags = () => request<Tag[]>({ method: 'GET', url: '/api/tags' })

export const getSettings = () =>
  request<GeneralSettings>({ method: 'GET', url: '/api/settings/general' })

export const updateSettings = (settings: GeneralSettingsDTO) =>
  request<GeneralSettingsDTO, GeneralSettings>({
    data: settings,
    method: 'POST',
    url: '/api/settings/general',
  })

export const getRadarrSettings = () =>
  request<RadarrSettings>({ method: 'GET', url: '/api/settings/radarr' })

export const updateRadarrSettings = (settings: RadarrSettingsDTO) =>
  request<RadarrSettingsDTO, RadarrSettings>({
    data: settings,
    method: 'POST',
    url: '/api/settings/radarr',
  })

export const pingRadarr = () =>
  request<RadarrPing>({ method: 'GET', url: '/api/radarr/ping' })

export const postPingRadarr = (settings: RadarrSettingsDTO) =>
  request<RadarrSettingsDTO, RadarrPing>({
    data: settings,
    method: 'POST',
    url: '/api/radarr/ping',
  })

export const syncRadarr = () =>
  request<void>({ method: 'POST', url: '/api/sync/radarr' })

export const getTautulliSettings = () =>
  request<TautulliSettings>({ method: 'GET', url: '/api/settings/tautulli' })

export const updateTautulliSettings = (settings: TautulliSettingsDTO) =>
  request<TautulliSettingsDTO, TautulliSettings>({
    data: settings,
    method: 'POST',
    url: '/api/settings/tautulli',
  })

export const pingTautulli = () =>
  request<TautulliPing>({ method: 'GET', url: '/api/radarr/ping' })

export const postPingTautulli = (settings: TautulliSettingsDTO) =>
  request<TautulliSettingsDTO, TautulliPing>({
    data: settings,
    method: 'POST',
    url: '/api/tautulli/ping',
  })

export const syncTautulli = () =>
  request<void>({ method: 'POST', url: '/api/sync/tautulli' })
