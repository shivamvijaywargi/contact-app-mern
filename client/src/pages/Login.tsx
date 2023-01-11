import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import axiosClient from "../http";
import useAuthStore from "../stores/authStore";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axiosClient.post("/auth", {
        email,
        password,
      });

      if (data.success) {
        setIsAuthenticated(true);
        axiosClient.defaults.headers.authorization = `Bearer ${data.accessToken}`;
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);

  return (
    <section className="grid place-items-center mt-12 mb-20">
      <h1 className="text-3xl">Login</h1>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Your Email</span>
          </label>
          <label className="input-group">
            <span className="w-24">Email</span>
            <input
              type="email"
              placeholder="info@site.com"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Your Password</span>
          </label>
          <label className="input-group">
            <span>Password</span>
            <input
              type="password"
              placeholder="********"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        <div className="grid place-items-center mt-6">
          <input
            type="submit"
            value="Login"
            className="btn btn-info btn-wide"
          />
        </div>
      </form>
    </section>
  );
};

export default Login;
