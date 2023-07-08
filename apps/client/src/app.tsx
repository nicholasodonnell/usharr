import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Redirect from './components/redirect'
import Toasts from './components/toasts'
import { useToast } from './hooks/useToast'
import Page from './views/_layout/page'
import Deleted from './views/movies/deleted'
import Ignored from './views/movies/ignored'
import Monitored from './views/movies/monitored'
import Rules from './views/rules'
import General from './views/settings/general'
import Radarr from './views/settings/radarr'
import Tautulli from './views/settings/tautulli'

export default function App(): JSX.Element {
  const { toasts } = useToast()

  return (
    <>
      <Routes>
        <Route element={<Page />}>
          <Route index element={<Redirect to="/movies" />} />
          <Route path="movies">
            <Route index element={<Redirect to="/movies/monitored" />} />
            <Route path="monitored" element={<Monitored />} />
            <Route path="ignored" element={<Ignored />} />
            <Route path="deleted" element={<Deleted />} />
          </Route>
          <Route path="rules" element={<Rules />} />
          <Route path="settings">
            <Route index element={<Redirect to="/settings/general" />} />
            <Route path="general" element={<General />} />
            <Route path="radarr" element={<Radarr />} />
            <Route path="tautulli" element={<Tautulli />} />
          </Route>
          <Route path="*" element={<Redirect to="/" />} />
        </Route>
      </Routes>
      <Toasts toasts={toasts} />
    </>
  )
}
