import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global/index.css'
import './styles/global/reset.css'
import './styles/global/button.css'

import PasswordReset from './features/account/PasswordReset'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='container flex items-center justify-center min-h-screen'>
      <div className='max-w-md w-full'>
        <PasswordReset />
      </div>
    </div>
  </StrictMode>,
)
