import axios from "axios";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosClient from "../http";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Enter valid email address");
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/auth/reset",
        {
          email,
        }
      );

      // Not sure for some reason my axios client is not working😢
      // const { data } = await axiosClient.post("/auth/reset", {
      //   email,
      // });

      if (data.success) {
        setIsLoading(false);
        toast.success(data.message);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        toast.error(error?.response?.data?.message);
      } else {
        setIsLoading(false);
        toast.error("Something went wrong, please try again");
      }
    }
  };

  return (
    <section className="grid place-items-center mt-12 mb-20">
      <h1 className="text-3xl">Reset Password</h1>
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

        <div className="grid place-items-center mt-6">
          {!isLoading ? (
            <input
              type="submit"
              value="Reset Password"
              className="btn btn-info btn-wide"
            />
          ) : (
            <button className="btn btn-info btn-wide loading"></button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ForgotPassword;
