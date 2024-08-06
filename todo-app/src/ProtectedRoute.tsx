import React from "react";
import pb from "./pocketbase";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = pb.authStore.isValid;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default ProtectedRoute;
