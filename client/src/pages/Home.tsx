import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <main className="grid place-items-center my-8">
      <div className="mockup-phone border-primary">
        <div className="camera"></div>
        <div className="display">
          <div className="artboard artboard-demo phone-1">
            <p className="mx-2">
              Welcome to contacts app, please login to create contacts/view all
              your saved contacts
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
