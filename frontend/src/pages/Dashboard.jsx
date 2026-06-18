import Navbar from "../components/Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActivePage = () => {
    if (location.pathname.includes("/teams")) return "Teams";
    if (location.pathname.includes("/projects")) return "Projects";
    if (location.pathname.includes("/tasks")) return "Tasks";
    if (location.pathname.includes("/documents")) return "Documents";
    return "Dashboard";
  };

  const handleNavigate = (page) => {
    switch (page) {
      case "Teams":
        navigate("/dashboard/teams");
        break;
      case "Projects":
        navigate("/dashboard/projects");
        break;
      case "Tasks":
        navigate("/dashboard/tasks");
        break;
      case "Documents":
        navigate("/dashboard/documents");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col overflow-hidden">
      <Navbar
        activePage={getActivePage()}
        onNavigate={handleNavigate}
        onLogout={logout}
      />

      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}