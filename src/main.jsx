import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { MusicProvider } from './context/MusicContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </ThemeProvider>
  </StrictMode>,
)
