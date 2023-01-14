import axios from "axios";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosClient from "../http";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Enter valid email address");
    }

    try {
      const resp = await axiosClient.post("/auth/reset", {
        email,
      });

      console.log(resp);
    } catch (error: any) {
      console.log(error);
      console.log(error.response.data.message);
    }

    // try {
    //   const resp = await axiosClient.post("/auth/reset", {
    //     email,
    //   });

    //   console.log(resp);

    //   // if (data?.success) {
    //   //   toast.success(data.message);
    //   // }
    // } catch (error: any) {
    //   console.log(error?.response?.data?.message);

    //   // if (axios.isAxiosError(error)) {
    //   //   toast.error(error?.response?.data?.message);
    //   // } else {
    //   //   toast.error("Something went wrong, please try again");
    //   // }
    // }
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
          <input
            type="submit"
            value="Reset Password"
            className="btn btn-info btn-wide"
          />
        </div>
      </form>
    </section>
  );
};

export default ForgotPassword;
