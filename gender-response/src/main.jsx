import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

console.log('Application starting...')

try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
  console.log('Application rendered successfully')
} catch (error) {
  console.error('Failed to render application:', error)
  document.getElementById('root').innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: #F44336;">Failed to load application</h1>
      <p>${error.message}</p>
      <p>Please check the browser console for more details.</p>
    </div>
  `
}

