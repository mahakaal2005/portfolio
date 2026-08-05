import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MotionProvider } from './animations/MotionContext'
import SmoothScroll from './animations/SmoothScroll'
import { injectSpeedInsights } from '@vercel/speed-insights'

injectSpeedInsights()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionProvider>
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </MotionProvider>
  </StrictMode>,
)
