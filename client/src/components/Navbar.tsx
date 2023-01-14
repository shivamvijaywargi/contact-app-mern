import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import axiosClient from "../http";

import useAuthStore from "../stores/authStore";
import { FormEvent, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    const { data } = await axiosClient.post("/auth/logout");

    if (data.success) {
      setIsAuthenticated(false);
      navigate("/");
      toast.success(data.message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phoneNumber) {
      toast.error("Name, Email, and Phone Number are required");
    }

    try {
      const { data } = await axiosClient.post(`/contacts`, {
        name,
        email,
        phoneNumber,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        toast.error("Something went wrong, please try again");
      }
    }
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost normal-case text-xl">
          Contaverse
        </Link>
      </div>
      <div className="flex-none gap-2">
        {/* <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered"
          />
        </div> */}
        {isAuthenticated ? (
          <>
            <label htmlFor="my-modal-4" className="btn btn-primary">
              Add Contact
            </label>

            <input type="checkbox" id="my-modal-4" className="modal-toggle" />
            <label htmlFor="my-modal-4" className="modal cursor-pointer">
              <label className="modal-box relative" htmlFor="">
                <h3 className="text-lg font-bold">Add New Contact</h3>
                <div className="py-4">
                  <div className="py-4">
                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                          value="Update"
                          className="btn btn-info btn-wide"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </label>
            </label>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://placeimg.com/80/80/people" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <NavLink to={"/profile"} className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard"}>Dashboard</NavLink>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to={"/login"} className="btn">
              Login
            </Link>
            <Link to={"/register"} className="btn">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
