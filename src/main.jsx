import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { DeliveryAppProvider } from './hooks/index.jsx'
import { AuthProvider } from './context/Protected'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <DeliveryAppProvider>
          <App />
        </DeliveryAppProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
)
