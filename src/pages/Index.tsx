import { Navigate } from "react-router-dom";
import Home from "./Home";

const Index = () => {
  const profileId = typeof window !== "undefined" ? localStorage.getItem("lulutales_profile_id") : null;
  if (!profileId) return <Navigate to="/onboarding" replace />;
  return <Home />;
};

export default Index;
