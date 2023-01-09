import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  return (
    <section className="container mx-auto">
      <Navbar />
      <Outlet />
      <h3>Footer</h3>
    </section>
  );
};

export default RootLayout;
