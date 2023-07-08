import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export type RedirectProps = {
  to: string
}

export default function Redirect({ to }: RedirectProps): JSX.Element {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(to)
  }, [navigate, to])

  return <></>
}
