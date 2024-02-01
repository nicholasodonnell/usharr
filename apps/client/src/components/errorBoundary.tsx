import React from 'react'

export default class ErrorBoundary extends React.Component {
  onUnhandledRejection = (e) => {
    e.promise.catch(() => {
      console.log('unhandledrejection', e)
    })

    e.stopImmediatePropagation()
    e.preventDefault()
  }

  props: {
    children: React.ReactNode
  }

  constructor(props) {
    super(props)
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo })
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.onUnhandledRejection)
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.onUnhandledRejection)
  }

  render() {
    return this.props.children
  }
}
