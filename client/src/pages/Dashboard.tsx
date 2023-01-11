import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const Dashboard = () => {
  const { isAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
