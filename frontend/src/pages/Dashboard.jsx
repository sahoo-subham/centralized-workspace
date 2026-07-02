import Navbar from "../components/Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";
import DashboardHome from "../components/dashboard/DashboardHome";

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
      <DashboardHome />
        <Outlet />
      </div>
    </div>
  );
}


// build the dashboard page and create it as mentioned in the pdf and it will show the no of teams, project, tasks and documents according to the user have 
// and make sure build a perfect ui that looks cool professional unique and interactive (using tailwind css)
// when i click the dashboard btn in the navbar it will open the dashboard page , when i click task it will open it like that instead of under the dashboard it will open in a page 