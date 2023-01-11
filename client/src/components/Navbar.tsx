import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import axiosClient from "../http";

import useAuthStore from "../stores/authStore";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const { data } = await axiosClient.post("/auth/logout");

    if (data.success) {
      setIsAuthenticated(false);
      navigate("/");
      toast.success(data.message);
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
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered"
          />
        </div>
        {isAuthenticated ? (
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
