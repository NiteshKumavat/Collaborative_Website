import React, { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Toaster } from "react-hot-toast";

// Page Imports
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import DashBoard from "./DashBoard.jsx";
import LandingPage from "./LandingPage.jsx";
import Profile from "./Profile.jsx";
import Developers from "./Developers.jsx";
import Chat from "./Chat.jsx";
import ForgotPassword from "./ForgotPassword.jsx"; // 👈 1. IMPORT THIS

// Component Imports
import PageLoader from "../components/PageLoader.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  // Hide Footer on these specific routes
  const hideFooterRoutes = ["/chats", "/login", "/register", "/", "/forgot-password"];
  const showFooter = !hideFooterRoutes.includes(location.pathname) || (location.pathname === "/" && authUser);

  // Hide Header logic
  const showHeader = authUser && !["/login", "/register", "/forgot-password"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0B0C15]">
      <Toaster />

      {showHeader && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={authUser ? <DashBoard /> : <LandingPage />}
          />

          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/" />} />

          {/* 👇 2. ADD THIS ROUTE */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/profile/:id" element={authUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/developers" element={authUser ? <Developers /> : <Navigate to="/login" />} />
          <Route path="/chats" element={authUser ? <Chat /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}