import React from 'react'

import Image from '../../public/assets/logo.svg'

export default function Logo(): React.ReactNode {
  return <img alt="Logo" className="w-full" src={Image as unknown as string} />
}
