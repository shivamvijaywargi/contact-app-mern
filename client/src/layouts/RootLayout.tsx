import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  const date = new Date();

  return (
    <section className="container mx-auto">
      <Navbar />
      <Outlet />
      <footer className="text-center">
        Copyright &copy; {date.getFullYear()}. Made with ❤️ by{" "}
        <a href="https://github.com/shivamvijaywargi">Shivam Vijaywargi</a>
      </footer>
    </section>
  );
};

export default RootLayout;
