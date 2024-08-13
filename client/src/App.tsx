import { Route, Routes, useLocation } from "react-router-dom"
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
import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

// 型定義
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

// ログイン状態を管理するContextを作成
const AuthContext = createContext<AuthContextType | null>(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 画面遷移時にログイン状態をチェック
    checkLoginStatus();
  }, [location.pathname]);

  const checkLoginStatus = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true })
    const loggedIn = res.data.loggedIn;;
    if (loggedIn !== isLoggedIn) {
      setIsLoggedIn(loggedIn);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Header />
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path='/' element={<Login />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/signup' element={<SignUp />} />
          <Route path='/account/password/change' element={<PasswordChange />} />
          <Route path='/account/password/reset-link' element={<PasswordResetLink />} />
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default App
