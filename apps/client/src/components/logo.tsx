import React from 'react'

import Image from '../../public/assets/logo.svg'

export default function Logo(): JSX.Element {
  return <img alt="Logo" className="w-full" src={Image as unknown as string} />
}
