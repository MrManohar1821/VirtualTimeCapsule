import React from "react";
import { useNavigate } from "react-router-dom";
const logo = "/MainLogo.png";

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center
                    bg-green-50 px-4 text-center font-serif">

      {/* Logo */}
      <div className="mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#9dd1b1]
                        flex items-center justify-center shadow-md">
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 sm:w-14 sm:h-14
                       rounded-full bg-[#025622] p-1 object-contain"
          />
        </div>
      </div>

      {/* 404 Text */}
      <h1 className="text-7xl sm:text-8xl font-extrabold text-[#025622]">
        404
      </h1>

      <h2 className="mt-3 text-xl sm:text-2xl font-bold text-[#190E20]">
        Page Not Found
      </h2>

      <p className="mt-2 max-w-md text-sm sm:text-base text-[#025622]">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Action Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-8 py-3 rounded-2xl
                   bg-green-200 text-[#190E20]
                   font-bold shadow hover:bg-green-300
                   transition active:scale-95"
      >
        Return to Home
      </button>

      {/* Decorative Divider */}
      <div className="mt-10 w-24 h-1 rounded-full bg-[#025622]" />
    </div>
  );
};

export default NotFound404;
