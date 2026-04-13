import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import "./Home.css";
import homeImage from "../assets/home.webp";

export default function Home() {
  const location = useLocation();
  const showWelcome = location.pathname === "/home";

  return (
    <>
      <Navbar />

      {/* 🔥 SCROLL CONTAINER */}
      <div className="page-container">
        {showWelcome && (
          <section
            className="home-hero"
            style={{ backgroundImage: `url(${homeImage})` }}
          >
            <div className="home-overlay">
              <h1>Welcome to Home Page Admin</h1>
              <p>Select an option from the navbar</p>
            </div>
          </section>
        )}

        <Outlet />
      </div>
    </>
  );
}
