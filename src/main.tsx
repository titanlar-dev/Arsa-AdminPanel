import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tokens/globals.css'
import { App } from './App'

// Varsayilan tema: corporate-blue. Kullanici tercihi degistiginde
// SettingsPage `data-theme` attribute'unu gunceller.
document.documentElement.setAttribute('data-theme', 'corporate-blue')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
