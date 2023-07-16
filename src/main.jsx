import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Context } from './components/Global/Context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Context>
    <App />
  </Context>
)
