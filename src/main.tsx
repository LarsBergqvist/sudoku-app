import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App'
import './index.css'

console.log('Environment variables:', {
  VITE_USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API,
  NODE_ENV: import.meta.env.MODE
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
) 