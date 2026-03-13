import { FaArrowRight } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import HeroImg from "../assets/Section1.png";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Section1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleCreateCapsule = () => {
    if (!user) {
      // Not logged in → scroll
      navigate("/login");
    } else if (user.role === "user") {
      navigate("/user");
    } else if (user.role === "admin") {
      navigate("/admin");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#012e5b] to-[#40c974] flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 md:px-10 py-10 lg:py-20">
      {/* Left Content */}
      <div className="flex flex-col justify-center p-3 md:p-10 max-w-xl lg:max-w-lg text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-amber-50 font-serif font-bold leading-tight">
          Digital Time Capsule Preserving Today for Tomorrow
        </h1>

        <p className="mt-5 text-amber-50 font-semibold text-sm sm:text-base md:text-lg">
          In just a few minutes, you can hold onto the moments and stories that matter most.
        </p>

        <div className="mt-6 border-2 rounded-3xl border-amber-50 text-amber-50 px-4 py-2 flex items-center justify-center lg:justify-start gap-3 font-bold text-sm sm:text-base">
          <CiLock size={22} />
          Securely Preserved for Generations
        </div>

        <div className="mt-8 flex justify-center lg:justify-start">
          <button onClick={handleCreateCapsule} className="w-full sm:w-auto rounded-lg bg-[#7acd9a] p-3 text-[#190E20] hover:cursor-pointer font-bold flex items-center justify-center gap-3 hover:bg-[#67b685] transition">
            Send Love Forward <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex justify-center mt-8 lg:mt-0 lg:ml-20 w-full lg:w-auto">
        <img
          src={HeroImg}
          alt="future"
          className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto rounded-xl shadow-lg object-contain"
        />
      </div>
    </div>
  );
};

export default Section1;
