import { Route, Routes } from "react-router";
import Error404 from "@/components/not-found";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "@/pages/DashboardPage";
import PublicRoute from "./PublicRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};
