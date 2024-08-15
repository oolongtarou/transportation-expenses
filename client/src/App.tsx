import { Route, Routes, useNavigate } from "react-router-dom"
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
import { createContext, useEffect, useState } from "react"
import MyPage from "./features/account/MyPage"
import { getWorkspaceWithSmallestId, Workspace } from "./lib/user-workspace"
import { Authority } from "./lib/auth"
import axios, { AxiosError } from "axios"

// 型定義
interface AuthContextType {
  isLoggedin: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

  currentWorkspace: Workspace | null;
  setCurrentWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;

  myWorkspaces: Workspace[];
  setMyWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;

  myAuthorities: Authority[];
  setMyAuthorities: React.Dispatch<React.SetStateAction<Authority[]>>;
}

// ログイン状態を管理するContextを作成
export const AuthContext = createContext<AuthContextType | null>(null);

function App() {
  const [isLoggedin, setIsLoggedIn] = useState<boolean>(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [myWorkspaces, setMyWorkspaces] = useState<Workspace[]>([]);
  const [myAuthorities, setMyAuthorities] = useState<Authority[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    // サーバーからユーザーのログイン状態やワークスペース、権限情報を取得
    axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true })
      .then((response) => {
        if (response.data.userId) {
          setIsLoggedIn(true);
          setMyWorkspaces(response.data.workspaces);
          setCurrentWorkspace(getWorkspaceWithSmallestId(response.data.workspaces));
          setMyAuthorities(response.data.authorities);
        } else {
          console.error(response.data.message);
          navigate("/");
        }
      })
      .catch((err: AxiosError) => {
        console.error(`サーバーエラーが発生しました：${err.code}`);
        navigate("/");
      });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      isLoggedin, setIsLoggedIn,
      currentWorkspace, setCurrentWorkspace,
      myWorkspaces, setMyWorkspaces,
      myAuthorities, setMyAuthorities
    }}>
      <Header isLoggedin={isLoggedin} />
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path='/' element={<Login />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/signup' element={<SignUp />} />
          <Route path='/account/password/reset-link' element={<PasswordResetLink />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path='/w/:workspaceId/app-form/create' element={<AppFormCreate appForm={appFormInitialData} />} />
          <Route path='/w/:workspaceId/app-form/list/me' element={<AppFormList />} />
          <Route path='/w/:workspaceId/app-form/list/approval' element={<AppFormList />} />

          <Route path='/w/:workspaceId/workspace/members' element={<MemberList />} />
          <Route path='/w/:workspaceId/workspace/approval-route' element={<ApprovalRoute />} />
          <Route path='/w/:workspaceId/workspace/setting' element={<WorkspaceSetting />} />
          <Route path='/w/:workspaceId/my-page' element={<MyPage />} />

          <Route path='/w/:workspaceId/account/password/change' element={<PasswordChange />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}

export default App
