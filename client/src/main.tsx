import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import './styles/global/index.css'
import './styles/global/reset.css'
import './styles/global/button.css'
import './styles/global/toggle.css'
import './styles/global/label.css'
import './styles/global/animation.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
