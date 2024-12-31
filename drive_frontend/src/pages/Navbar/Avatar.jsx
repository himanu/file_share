import React, { useState } from "react";

const NavbarAvatar = ({ userEmail, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsModalOpen(true);
  };

  const handleMouseLeave = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative flex items-center">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Placeholder for Avatar Initial */}
        <span className="text-lg font-bold text-white">U</span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="z-[10] absolute top-[40%] right-[90%] mt-2  bg-white border border-gray-200 rounded-lg shadow-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* User Email */}
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm text-gray-700 font-medium">{userEmail}</p>
          </div>

          {/* Logout Button */}
          <div className="p-4">
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarAvatar;
