import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import axiosClient from "../http";
import useAuthStore from "../stores/authStore";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const { data } = await axiosClient.post("/auth/new", {
        name,
        email,
        password,
        phoneNumber,
      });

      if (data.success) {
        console.log(data);
        setIsAuthenticated(true);
        axiosClient.defaults.headers.authorization = `Bearer ${data.accessToken}`;
        toast.success(data.message);
        navigate("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <section className="grid place-items-center mt-12 mb-20">
      <h1 className="text-3xl">Register</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="input-group input-group-vertical">
            <span>Name</span>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="input-group input-group-vertical">
            <span>Email</span>
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
          <label className="input-group input-group-vertical">
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
        <div className="form-control">
          <label className="input-group input-group-vertical">
            <span>Confirm Password</span>
            <input
              type="password"
              placeholder="********"
              className="input input-bordered"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="input-group input-group-vertical">
            <span>Phone Number</span>
            <input
              type="number"
              placeholder="1234567890"
              className="input input-bordered"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </label>
        </div>
        <div className="grid place-items-center mt-6">
          <input
            type="submit"
            value="Register"
            className="btn btn-info btn-wide"
          />
        </div>
      </form>
    </section>
  );
};

export default Register;
