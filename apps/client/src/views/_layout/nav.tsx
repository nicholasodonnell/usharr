import cx from 'classnames'
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Bolt, Gear, Movie } from '../../components/icon'
import { Bars } from '../../components/icon'
import Logo from '../../components/logo'

export type NavProps = {
  title: string
  to: string
}

export type TopNavProps = NavProps & {
  children?: React.ReactNode
  icon: JSX.Element
}

export function TopNav({
  children,
  icon,
  title,
  to,
}: TopNavProps): JSX.Element {
  return (
    <li className="-mx-2">
      <NavLink
        className={({ isActive }) =>
          cx(
            'flex items-center rounded-lg px-2 py-3 text-xl transition-colors hover:bg-app-background-light',
            {
              'bg-gradient-to-r from-purple to-pink': !children && isActive,
            },
          )
        }
        to={to}>
        {React.cloneElement(icon, { className: 'mr-4 h-6 w-6' })} {title}
      </NavLink>
      {children && (
        <ul className="grid w-full grid-cols-1 gap-2 pl-4 pt-4">{children}</ul>
      )}
    </li>
  )
}

export function SubNav({ title, to }: NavProps): JSX.Element {
  return (
    <li className="w-full">
      <NavLink
        className={({ isActive }) =>
          cx(
            'text-md flex items-center rounded-lg px-4 py-3 transition-colors hover:bg-app-background-light',
            {
              'bg-gradient-to-r from-purple to-pink': isActive,
            },
          )
        }
        to={to}>
        {title}
      </NavLink>
    </li>
  )
}

export default function Nav(): JSX.Element {
  const { pathname } = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  return (
    <>
      <div className="fixed inset-x-0 z-30 flex h-20 w-full items-center border-b border-b-app-background-accent bg-app-background px-4 shadow md:hidden">
        <button
          className="absolute h-12 w-12 md:hidden"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          type="button">
          <Bars />
        </button>
        <NavLink className="mx-auto w-40" to="/">
          <Logo />
        </NavLink>
      </div>
      <nav
        className={cx(
          'fixed left-0 z-20 mt-20 flex w-full flex-col overflow-hidden border-r-[1px] border-r-app-background-accent bg-app-background md:mt-0 md:w-64',
          {
            'h-0 md:h-screen': !mobileNavOpen,
            'h-screen': mobileNavOpen,
          },
        )}>
        <div className="p-4 md:py-8">
          <NavLink className="mb-12 hidden md:block" to="/">
            <Logo />
          </NavLink>
          <ul className="grid grid-cols-1 gap-6">
            <TopNav icon={<Movie />} title="Movies" to="/movies">
              <SubNav title="Monitored" to="/movies/monitored" />
              <SubNav title="Ignored" to="/movies/ignored" />
              <SubNav title="Deleted" to="/movies/deleted" />
            </TopNav>
            <TopNav icon={<Bolt />} title="Rules" to="/rules" />
            <TopNav icon={<Gear />} title="Settings" to="/settings">
              <SubNav title="General" to="/settings/general" />
              <SubNav title="Radarr" to="/settings/radarr" />
              <SubNav title="Tautulli" to="/settings/tautulli" />
            </TopNav>
          </ul>
        </div>
      </nav>
    </>
  )
}
