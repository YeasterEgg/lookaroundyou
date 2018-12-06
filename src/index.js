import React from 'react'
import ReactDOM from 'react-dom'
import App from 'components/App.tsx'
import 'modern-normalize'
import '@accurat/tachyons-lite'
import 'tachyons-extra'
import 'style.css'

function renderApp() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
