import { logoutUser } from "../../store/auth/action";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NavbarAvatar from "./Avatar";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
        <img
          src="/files-icon.jpg"
          alt="File Drive Icon"
          className="w-8 h-8"
        />
        <span className="text-lg font-semibold">File Drive</span>
      </div>

      {/* Right Section: Logout Button */}
      <NavbarAvatar userEmail={user?.email} onLogout={() => dispatch(logoutUser(navigate))} />
      {/* <button
        onClick={() => dispatch(logoutUser())}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
      >
        Logout
      </button> */}
    </nav>
  );
};

export default Navbar;
