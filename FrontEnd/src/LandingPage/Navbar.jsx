import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Sync user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // updates when route changes

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLinkClick = (callback) => {
    callback();
    setMenuOpen(false);
  };

  // ✅ Smart Create Capsule Logic
  const handleCreateCapsule = () => {
    if (!user) {
      // Not logged in → scroll
      scrollTo("create-capsule");
    } else if (user.role === "user") {
      navigate("/user");
    } else if (user.role === "admin") {
      navigate("/admin");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 bg-[#f2eee3] shadow-md">
      <div className="flex justify-between items-center h-16 px-4 md:px-8">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            className="w-10 h-10 rounded-full bg-blue-950"
            src={logo}
            alt="logo"
          />
          <span className="font-serif font-bold text-lg text-blue-950">
            Virtual Time Capsule
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollTo("about")}
            className="hover:underline-offset-3 hover:underline font-serif font-bold lg:hover:cursor-pointer"
          >
            About
          </button>

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg font-serif font-bold text-[#190E20] bg-[#95d4ad] px-10 py-2 hover:bg-[#5dba81] transition lg:hover:cursor-pointer"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-lg font-serif font-bold text-white bg-red-500 px-10 py-2 hover:bg-red-600 transition lg:hover:cursor-pointer"
            >
              Logout
            </button>
          )}

          <button
            onClick={handleCreateCapsule}
            className="rounded-lg bg-[#7acd9a] px-3 py-2 text-[#190E20] font-serif font-bold hover:bg-[#5dba81] transition lg:hover:cursor-pointer"
          >
            Create Your Capsule
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-3xl focus:outline-none"
          >
            <HiOutlineMenu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-3xl focus:outline-none"
          >
            <HiOutlineX />
          </button>
        </div>

        <div className="flex flex-col gap-6 mt-6 px-6">
          <button
            onClick={() => handleLinkClick(() => scrollTo("about"))}
            className="text-lg font-medium text-left"
          >
            About
          </button>

          {!user ? (
            <button
              onClick={() => handleLinkClick(() => navigate("/login"))}
              className="rounded-lg bg-amber-100 px-3 py-2 font-medium text-left"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => handleLinkClick(handleLogout)}
              className="rounded-lg bg-red-500 text-white px-3 py-2 font-medium text-left"
            >
              Logout
            </button>
          )}

          <button
            onClick={() => handleLinkClick(handleCreateCapsule)}
            className="rounded-lg bg-yellow-500 px-3 py-2 text-white font-bold text-left"
          >
            Create Your Capsule
          </button>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;