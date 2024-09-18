import { useEffect, useState } from "react";
import { IoFastFoodOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { FaCartArrowDown } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaRocket } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";

import axios from "axios";
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState("Users");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/v1/check-auth");
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

const user = async () => {
  try {
    const response = await axios.get(
      "https://mern-food-bl34.onrender.com/api/v1/me", 
      { withCredentials: true } 
    );
    console.log("user32=>", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};



  const isAuth_ = async () => {
    const isAuthenticated = await checkAuth();
    setIsAuth(isAuthenticated);
    const user_details = await user();
    setUserName(user_details.user.name);
    setUserEmail(user_details.user.email);
  };
  const logout = async () => {
    try {
      const response = await axios.get("/api/v1/logout");
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    isAuth_();
    user();
  }, []);

  return (
    <header className="flex justify-between items-center p-4 border-b bg-gray-50 px-10 ">
      <Link to={"/"} className="flex items-center text-3xl text-orange-600">
        <IoFastFoodOutline />
        <span className="font-mono text-xl font-semibold">Food</span>
      </Link>
      <div className="flex items-center space-x-4">
        <span className="text-red-500 text-lg font-mono font-semibold">
          <span className="text-red-600">Hello</span>,{userName}👋👋
        </span>
      </div>
      <div className="flex justify-center items-center gap-4 font-mono">
        <Link
          to={"/"}
          className="hover:scale-105 hover:text-orange-600 font-medium hover:underline underline-offset-8"
        >
          Home
        </Link>
        <Link
          to={"/menu"}
          className="hover:scale-105 hover:text-orange-600 font-medium hover:underline underline-offset-8"
        >
          Menu
        </Link>
        <Link
          to={"/cart"}
          className="hover:scale-110 hover:text-orange-600 text-xl"
        >
          <FaCartArrowDown />
        </Link>
        {/* Dropdown for user Avatar */}
        {isAuth ? (
          <div>
            <img
              id="avatarButton"
              type="button"
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full cursor-pointer"
              src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
              alt="User dropdown"
            />
            <div
              id="userDropdown"
              className={`z-10 ${
                dropdownOpen ? "" : "hidden"
              } bg-white absolute right-8 top-22 divide-y divide-gray-600 rounded-lg shadow w-48 border`}
            >
              <div className="px-4 py-3 text-sm text-gray-900">
                <div className="text-orange-600 font-mono text-xl">
                  {userName}
                </div>
                <div className="font-medium truncate font-mono">
                  {userEmail}
                </div>
              </div>
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="avatarButton"
              >
              <Link
                  to={"/order"}
                  className="flex px-4 py-2 hover:bg-gray-100  items-center gap-2"
                >
                  <FaBagShopping />
                  My Order
                </Link>
                <Link
                  to={"/settings"}
                  className="flex px-4 py-2 hover:bg-gray-100  items-center gap-2"
                >
                  <IoSettings />
                  Settings
                </Link>


                <a
                  className="flex px-4 py-2 hover:bg-gray-100  items-center gap-2"
                  href={`mailto:shangesh2006@gmail.com`}
                >
                  <FaRocket />
                  Contact_Us
                </a>
              </ul>
              <div className="py-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    logout();
                  }}
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        ) : (
          <Link to={"/signin"} className="text-red-600">
            Signin
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
