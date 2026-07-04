import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Dashboard      from "./pages/Dashboard";
import DashboardHome  from "./components/dashboard/DashboardHome";
import Teams          from "./pages/Teams";
import Projects       from "./pages/Projects";
import Tasks          from "./pages/Tasks";
import Documents      from "./pages/Documents";
import Profile        from "./pages/Profile";
import Error404       from "./pages/Error404";
import Support        from "./pages/Support";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("access_token");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"            element={<Login />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/forgot-password"  element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token/" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index          element={<DashboardHome />} />
          <Route path="teams"     element={<Teams />} />
          <Route path="projects"  element={<Projects />} />
          <Route path="tasks"     element={<Tasks />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile"   element={<Profile />} />
        </Route>

        <Route path="/"  element={<Navigate to="/login" />} />
        <Route path="*"  element={<Error404 />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;