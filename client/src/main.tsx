import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";

import './styles/global/index.css'
import './styles/global/reset.css'
import './styles/global/button.css'
import './styles/global/toggle.css'
import './styles/global/pagination.css'
import './styles/global/label.css'
import App from './App'
import AppFormCreate from './features/application-form/AppFormCreate';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/menu",
    element: <AppFormCreate />
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
