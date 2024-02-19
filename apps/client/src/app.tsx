import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Redirect from './components/redirect'
import Toasts from './components/toasts'
import Page from './views/_layout/page'
import Deleted from './views/movies/deleted'
import Ignored from './views/movies/ignored'
import Monitored from './views/movies/monitored'
import Rules from './views/rules'
import General from './views/settings/general'
import Radarr from './views/settings/radarr'
import Tautulli from './views/settings/tautulli'

export default function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route element={<Page />}>
          <Route element={<Redirect to="/movies" />} index />
          <Route path="movies">
            <Route element={<Redirect to="/movies/monitored" />} index />
            <Route element={<Monitored />} path="monitored" />
            <Route element={<Ignored />} path="ignored" />
            <Route element={<Deleted />} path="deleted" />
          </Route>
          <Route element={<Rules />} path="rules" />
          <Route path="settings">
            <Route element={<Redirect to="/settings/general" />} index />
            <Route element={<General />} path="general" />
            <Route element={<Radarr />} path="radarr" />
            <Route element={<Tautulli />} path="tautulli" />
          </Route>
          <Route element={<Redirect to="/" />} path="*" />
        </Route>
      </Routes>
      <Toasts />
    </>
  )
}
