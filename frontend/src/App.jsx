import React, { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { Toaster } from "react-hot-toast"; 

// Page Imports
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Profile from "./pages/Profile.jsx";
import Developers from "./pages/Developers.jsx";
import Chat from "./pages/Chat.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import PageLoader from "./components/PageLoader.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CallPage from "./pages/Call.jsx";
import Pricing from "./pages/Pricing.jsx";

export default function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  const hideFooterRoutes = ["/chats", "/login", "/register", "/", "/forgot-password"];
  const showFooter = !hideFooterRoutes.includes(location.pathname) || (location.pathname === "/" && authUser);
  const showHeader = authUser && !["/login", "/register", "/forgot-password"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0B0C15]">
      <Toaster position="top-center" reverseOrder={false}
        toastOptions={{
          style: {
            zIndex: 9999,
            background: '#333',
            color: '#fff',
          },
          className: 'z-[9999]',
        }}
      />

      {showHeader && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={authUser ? <DashBoard /> : <LandingPage />}
          />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile/:id" element={authUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/developers" element={authUser ? <Developers /> : <Navigate to="/login" />} />
          <Route path="/chats" element={authUser ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/:id/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
          <Route path="/pricing" element={authUser ? <Pricing /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}