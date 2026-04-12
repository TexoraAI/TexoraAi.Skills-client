import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import UsersPage from "./pages/UsersPage";
import NotFound from "./pages/NotFound";

export default function RoutesApp() {
return (
    <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/courses" element={<CoursesPage />} />
    <Route path="/users" element={<UsersPage />} />
    <Route path="*" element={<NotFound />} />
    </Routes>
);
}












