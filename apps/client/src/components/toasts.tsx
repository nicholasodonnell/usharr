import React from 'react'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export default function Toasts() {
  return (
    <ToastContainer
      autoClose={3000}
      closeOnClick={true}
      draggable={false}
      hideProgressBar={false}
      newestOnTop={true}
      pauseOnFocusLoss={false}
      pauseOnHover={true}
      position="bottom-left"
      rtl={false}
      theme="colored"
    />
  )
}
