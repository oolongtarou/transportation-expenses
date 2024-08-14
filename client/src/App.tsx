import { Route, Routes } from "react-router-dom"
import Login from "./features/account/Login"
import SignUp from "./features/account/SignUp"
import PasswordChange from "./features/account/PasswordChange"
import PasswordResetLink from "./features/account/PasswordResetLink"
import Header from "./components/Header"
import AppFormCreate from "./features/application-form/AppFormCreate"
import LoginLayout from "./features/layout/LoginLayout"
import MainLayout from "./features/layout/MainLayout"
import { appFormInitialData } from "./features/application-form/app-form"
import AppFormList from "./features/application-form/AppFormList"
import WorkspaceSetting from "./features/workspace/WorkspaceSetting"
import MemberList from "./features/workspace/MemberList"
import ApprovalRoute from "./features/workspace/ApprovalRoute"
import { createContext, useState } from "react"
import MyPage from "./features/account/MyPage"

// 型定義
interface AuthContextType {
  isLoggedin: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  currentWorkspace: number | null;
  setCurrentWorkspace: React.Dispatch<React.SetStateAction<number | null>>;
}

// ログイン状態を管理するContextを作成
export const AuthContext = createContext<AuthContextType | null>(null);

function App() {
  const [isLoggedin, setIsLoggedIn] = useState<boolean>(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<number | null>(null);

  return (
    <AuthContext.Provider value={{ isLoggedin, setIsLoggedIn, currentWorkspace, setCurrentWorkspace }}>
      <Header isLoggedin={isLoggedin} />
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path='/' element={<Login />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/signup' element={<SignUp />} />
          <Route path='/account/password/change' element={<PasswordChange />} />
          <Route path='/account/password/reset-link' element={<PasswordResetLink />} />
          <Route path='/account/my-page' element={<MyPage />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path='/app-form/create' element={<AppFormCreate appForm={appFormInitialData} />} />
          <Route path='/app-form/list/me' element={<AppFormList />} />
          <Route path='/app-form/list/approval' element={<AppFormList />} />

          <Route path='/workspace/:id/members' element={<MemberList />} />
          <Route path='/workspace/:id/approval-route' element={<ApprovalRoute maxStep={5} approvers={[]} />} />
          <Route path='/workspace/:id/setting' element={<WorkspaceSetting />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}

export default App
