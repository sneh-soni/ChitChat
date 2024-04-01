import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute.jsx";
import { LayoutLoader } from "./components/Layout/Loaders.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth.js";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const Groups = lazy(() => import("./pages/Groups.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement.jsx"));
const MessageManagement = lazy(() =>
  import("./pages/admin/MessageMangement.jsx")
);
const UserManagement = lazy(() => import("./pages/admin/UserManagement.jsx"));

const App = () => {
  const dispatch = useDispatch();
  const { user, loader } = useSelector((store) => store.auth);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER + `/api/v1/users/me`, {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(userExists(res.data.user));
      })
      .catch((err) => {
        dispatch(userNotExists());
      });
  }, [dispatch]);

  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={<ProtectRoute user={user} redirect="/login" />}>
            <Route path="/" element={<Home />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/chat/:chatId" element={<Chat />} />
          </Route>
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users-management" element={<UserManagement />} />
          <Route path="/admin/chats-management" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="top-center" />
    </BrowserRouter>
  );
};

export default App;
