import React from "react";
const logo = "/MainLogo.png"; // served from public folder

const Loader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      
      {/* Spinner Wrapper */}
      <div className="relative flex items-center justify-center
                      w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40">

        {/* Animated Circle */}
        <div
          className="absolute inset-0 rounded-full
                     border-4 sm:border-[5px] md:border-[6px]
                     border-dashed border-[#025622]
                     animate-spin"
        />

        {/* Center Logo */}
        <div
          className="flex items-center justify-center
                     w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
                     rounded-full bg-[#9dd1b1] shadow-lg"
        >
          <img
            src={logo}
            alt="Main Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                       object-contain rounded-full bg-[#025622] p-1"
          />
        </div>
      </div>

      {/* Text */}
      <h2 className="mt-6 text-lg sm:text-xl md:text-2xl
                     font-bold text-[#190E20]">
        Loading...
      </h2>

      <p className="mt-1 text-sm sm:text-base text-[#025622]">
        Your adventure is about to begin
      </p>
    </div>
  );
};

export default Loader;
