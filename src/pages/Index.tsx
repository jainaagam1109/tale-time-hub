import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Home from "./Home";

const Index = () => {
  const { session, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/auth" replace />;
  return <Home />;
};

export default Index;
