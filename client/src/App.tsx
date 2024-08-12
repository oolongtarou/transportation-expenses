import { Route, Routes } from "react-router-dom"
import Login from "./features/account/Login"
import SignUp from "./features/account/SignUp"
import PasswordChange from "./features/account/PasswordChange"
import PasswordResetLink from "./features/account/PasswordResetLink"
import Header from "./components/Header"
import AccountRouter from "./features/account/AccountRouter"
import MainRouter from "./features/account/MainRouter"
import AppFormCreate from "./features/application-form/AppFormCreate"

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route element={<AccountRouter />}>
          <Route path='/' element={<Login />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/signup' element={<SignUp />} />
          <Route path='/account/password/change' element={<PasswordChange />} />
          <Route path='/account/password/reset-link' element={<PasswordResetLink />} />
        </Route>
        <Route element={<MainRouter />}>
          <Route path='/menu' element={<AppFormCreate />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
