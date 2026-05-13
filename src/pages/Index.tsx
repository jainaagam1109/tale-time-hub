import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "./Dashboard";

const Index = () => {
  const { session, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/auth" replace />;
  return <Dashboard />;
};

export default Index;
