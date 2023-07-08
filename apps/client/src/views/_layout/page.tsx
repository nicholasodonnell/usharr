import React from 'react'
import { Outlet } from 'react-router-dom'

import Main from './main'
import Nav from './nav'

export default function Page(): JSX.Element {
  return (
    <div className="bg-app-background-flex relative flex h-screen w-screen flex-row overflow-hidden font-mono text-white">
      <Nav />
      <Main>
        <Outlet />
      </Main>
    </div>
  )
}
