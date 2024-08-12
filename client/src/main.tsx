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
import Header from './components/Header';
import Login from './features/account/Login';
import SignUp from './features/account/SignUp';
import PasswordChange from './features/account/PasswordChange';
import PasswordResetLink from './features/account/PasswordResetLink';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/account/login",
    element: <Login />
  },
  {
    path: "/account/signup",
    element: <SignUp />
  },
  {
    path: "/account/password/change",
    element: <PasswordChange />
  },
  {
    path: "/account/password/reset-link",
    element: <PasswordResetLink />
  },
  {
    path: "/menu",
    element: <AppFormCreate />
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <div className="flex items-center justify-center main-content">
      <div className="container max-w-xl">
        <RouterProvider router={router} />
      </div >
    </div >
  </StrictMode>,
)
