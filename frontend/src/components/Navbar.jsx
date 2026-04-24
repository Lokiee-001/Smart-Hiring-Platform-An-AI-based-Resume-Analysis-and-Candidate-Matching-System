import React from "react";

const Navbar = () => {
  return (
    <div className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-xl font-bold text-blue-600">
        Smart Hiring Platform
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Student</span>

        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
          P
        </div>
      </div>

    </div>
  );
};

export default Navbar;