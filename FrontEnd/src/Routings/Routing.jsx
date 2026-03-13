import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Loader & 404
import Loader from "../DashBoards/Loader";
import PageNotFound from "../DashBoards/PageNotFound";

// Landing page
import HomePage from "../LandingPage/HomePage";

// Login & Registration
import LoginForm from "../LoginForms/LoginForm";
import RegistrationForm from "../LoginForms/RegistrationForm";

// Admin Dashboard
import {
  AdminDashboard,
  Topbar,
  Dashboard,
  Users,
  Capsules,
} from "../DashBoards/AdminDashboard";

// User Dashboard pages
import CreateCapsule from "../DashBoards/CreateCapsule";
import CapsuleInputs from "../DashBoards/CapsuleInputs";
import InviteContributer from "../DashBoards/InviteContributer";
import ProfileCard from "../DashBoards/ProfileCard";

/* ==================== PROTECTED ROUTES ==================== */

function ProtectedAdmin() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function ProtectedUser() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/* ==================== ROUTING ==================== */

export default function Routing() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* ==================== PUBLIC ==================== */}

          {/* Home Page (Public for everyone) */}
          <Route path="/" element={<HomePage />} />

          {/* Login */}
          <Route path="/login" element={<LoginForm />} />

          {/* Registration */}
          <Route path="/register" element={<RegistrationForm />} />

          {/* ==================== ADMIN ROUTES ==================== */}
          <Route path="/admin" element={<ProtectedAdmin />}>
            <Route
              index
              element={
                <div className="flex flex-col lg:flex-row">
                  <AdminDashboard />
                  <div className="flex-1 bg-gray-100 min-h-screen">
                    <Topbar />
                    <Dashboard />
                  </div>
                </div>
              }
            />
            <Route
              path="users"
              element={
                <div className="flex flex-col lg:flex-row">
                  <AdminDashboard />
                  <div className="flex-1 bg-gray-100 min-h-screen">
                    <Topbar />
                    <Users />
                  </div>
                </div>
              }
            />
            <Route
              path="capsules"
              element={
                <div className="flex flex-col lg:flex-row">
                  <AdminDashboard />
                  <div className="flex-1 bg-gray-100 min-h-screen">
                    <Topbar />
                    <Capsules />
                  </div>
                </div>
              }
            />
          </Route>

          {/* ==================== USER ROUTES ==================== */}
          <Route path="/user" element={<ProtectedUser />}>
            <Route index element={<CreateCapsule />} />
            <Route path="capsuleInputs" element={<CapsuleInputs />} />
            <Route path="invitecontributer" element={<InviteContributer />} />
            <Route path="profile" element={<ProfileCard />} />
          </Route>

          {/* ==================== 404 ==================== */}
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}