import React, { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import logo from "../images/menu_logo.png";
import "../styles/header.css";
import { Link, useLocation } from "react-router-dom";
import DropdownProfile from "./DropDownProfile";
import Avatar from "../images/Avatar.png";
import UserContext from "../context/UserContext";

const Header = () => {
  const { setUser } = useContext(UserContext);
  const [userRole, setUserRole] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const decoded = jwtDecode(token);
        const role = decoded.Role;
        setUserRole(role);
        setUser(decoded);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  localStorage.setItem("role", userRole);
  const changeBackground = () => {
    if (window.scrollY >= 100) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      window.addEventListener("scroll", changeBackground);
      return () => {
        window.removeEventListener("scroll", changeBackground);
      };
    } else {
      setNavbar(true);
    }
  }, [location.pathname]);

  return (
    <div
      className={`fixed w-full ${
        navbar ? "navbar active " : "navbar"
      } transition-all duration-300`}
    >
      <div className="flex justify-between items-center p-4">
        <img className="h-12 ml-[112px]" src={logo} alt="Logo" />
        <div className="block lg:hidden">
          <button
            onClick={toggleDrawer}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <ul className="hidden lg:flex space-x-12 items-center">
          <li>
            <Link to="/" className="text-white">
              Home
            </Link>
          </li>
          {userRole === "Manager" && (
            <>
              <li>
                <Link to="/createTournament" className="text-white">
                  Create Tournament
                </Link>
              </li>
              <li>
                <Link to="/findTournament" className="text-white">
                  Find Tournament
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-white">
                  News
                </Link>
              </li>
            </>
          )}
          {userRole === "Athletes" && (
            <ul className="hidden lg:flex space-x-12 items-center">
              <li>
                <Link to="/findTournament" className="text-white">
                  Find Tournament
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-white">
                  News
                </Link>
              </li>
            </ul>
          )}
          {!userRole && (
            <>
              <li>
                <Link to="/findTournament" className="text-white">
                  Find Tournament
                </Link>
              </li>
              <li>
                <Link to="/News" className="text-white">
                  News
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-white bg-[#C6C61A] mr-[112px] px-4 py-2 rounded-lg"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
          {(userRole === "Manager" || userRole === "Athletes") && (
            <li>
              <img
                className="h-12 w-12 mr-[112px] rounded-full cursor-pointer"
                onClick={() => setOpenProfile(!openProfile)}
                src={Avatar}
                alt="Avatar"
              />
              {openProfile && <DropdownProfile />}
            </li>
          )}
        </ul>
      </div>

      <div className={`lg:hidden ${isDrawerOpen ? "block" : "hidden"}`}>
        <ul className="flex flex-col items-center space-y-4">
          <li>
            <Link to="/" className="text-white">
              Home
            </Link>
          </li>
          {userRole === "Manager" && (
            <>
              <li>
                <Link to="/createTournament" className="text-white">
                  Create Tournament
                </Link>
              </li>
              <li>
                <Link to="/findTournament" className="text-white">
                  Find Tournament
                </Link>
              </li>
            </>
          )}
          {userRole === "Athletes" && (
            <li>
              <Link to="/findTournament" className="text-white">
                Find Tournament
              </Link>
            </li>
          )}
          {!userRole && (
            <>
              <li>
                <Link to="/findTournament" className="text-white">
                  Find Tournament
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
          {(userRole === "Manager" || userRole === "Athletes") && (
            <li>
              <img
                className="h-8 w-8 rounded-full cursor-pointer mb-6"
                onClick={() => setOpenProfile(!openProfile)}
                src={Avatar}
                alt="Avatar"
              />
              {openProfile && <DropdownProfile />}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
