import "../styles/manager.css";
import Avatar from "../images/Avatar.png";

import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { TbTournament } from "react-icons/tb";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { GiPodiumWinner } from "react-icons/gi";
import { FaUser } from "react-icons/fa6";
import { GiTennisCourt } from "react-icons/gi";
import { IoNewspaperOutline } from "react-icons/io5";

import { useEffect, useState } from "react";
import ManageUser from "../components/ManageUser";
import ClubRegister from "../components/ClubRegister";
import Court from "../components/Court";
import WinCondition from "../components/WinCondition";
import News from "../components/News";
import { jwtDecode } from "jwt-decode";

const Manager = () => {
  const [userDropdown, setUserDropdown] = useState(false);
  const [clubDropdown, setClubDropdown] = useState(false);
  const [tournamentDropdown, setTournamentDropdown] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [active, setActive] = useState(false);
  const [user, setUser] = useState(null);

  const toggleDropdown = (dropdown) => {
    if (dropdown === "user") {
      setUserDropdown(!userDropdown);
      setClubDropdown(false);

      setTournamentDropdown(false);
    } else if (dropdown === "club") {
      setClubDropdown(!clubDropdown);
      setUserDropdown(false);

      setTournamentDropdown(false);
    } else if (dropdown === "tournament") {
      setTournamentDropdown(!tournamentDropdown);
      setUserDropdown(false);

      setClubDropdown(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          userId: decodedToken.UserId,
          userName: decodedToken.UserName,
          role: decodedToken.Role,
        });
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const toggleActiveNews = () => {
    setActive(!active);
    setActiveComponent("News");
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/managerlogin";
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "ManageUser":
        return <ManageUser />;
      case "Court":
        return <Court />;
      case "winCondition":
        return <WinCondition />;
      case "News":
        return <News />;
      case "clubRegister":
        return <ClubRegister />;

      default:
        return <h1>Welcome to the Manager Dashboard</h1>;
    }
  };
  return (
    <div className="flex">
      <div className="manager-header relative">
        <div className="text-white flex gap-4 mb-[48px] pt-[32px] pl-[40px]">
          <img className="w-[48px] h-[48px]" src={Avatar} alt=""></img>
          <div>
            <p>{user?.userName}</p>
            <p>{user?.role}</p>
          </div>
        </div>
        <div className="grow">
          <ul className="flex flex-col manager-menu text-white">
            <li
              className={`flex items-center gap-2 menu-span cursor-pointer ${
                userDropdown ? "active" : ""
              }`}
              onClick={() => toggleDropdown("user")}
            >
              <FaUser />
              User
              <span className="ml-auto mr-4">
                {userDropdown ? (
                  <MdOutlineKeyboardArrowDown />
                ) : (
                  <MdOutlineKeyboardArrowLeft />
                )}
              </span>
            </li>

            {userDropdown && (
              <div
                className={`dropdown-content menu-span ${
                  userDropdown ? "active" : ""
                }`}
              >
                <div className="flex items-center gap-2 border-b border-white h-[60px] pl-4 cursor-pointer">
                  <AiOutlineUsergroupAdd /> Add User
                </div>
                <div
                  className="dropdown-item menu-span gap-2 border-b border-white h-[60px] flex items-center pl-4 cursor-pointer"
                  onClick={() => setActiveComponent("ManageUser")}
                >
                  <FaUserEdit /> Manage User
                </div>
              </div>
            )}
            <li
              className={`flex items-center gap-2 menu-span cursor-pointer ${
                clubDropdown ? "active" : ""
              }`}
              onClick={() => toggleDropdown("club")}
            >
              <FaUserGroup />
              Club
              <span className="ml-auto mr-4">
                {clubDropdown ? (
                  <MdOutlineKeyboardArrowDown />
                ) : (
                  <MdOutlineKeyboardArrowLeft />
                )}
              </span>
            </li>
            {clubDropdown && (
              <div className="dropdown-content">
                <div
                  className={`dropdown-item menu-span ${
                    clubDropdown ? "active" : ""
                  }`}
                >
                  <div
                    className="flex items-center gap-2 border-b border-white h-[60px] pl-4 cursor-pointer"
                    onClick={() => setActiveComponent("clubRegister")}
                  >
                    <AiOutlineUserAdd /> Club Register
                    <div />
                  </div>
                </div>
              </div>
            )}
            <li
              className={`flex items-center gap-2 menu-span cursor-pointer ${
                tournamentDropdown ? "active" : ""
              }`}
              onClick={() => toggleDropdown("tournament")}
            >
              <TbTournament />
              Tournament
              <span className="ml-auto mr-4">
                {tournamentDropdown ? (
                  <MdOutlineKeyboardArrowDown />
                ) : (
                  <MdOutlineKeyboardArrowLeft />
                )}
              </span>
            </li>
            {tournamentDropdown && (
              <div
                className={`dropdown-item menu-span ${
                  tournamentDropdown ? "active" : ""
                }`}
              >
                <div
                  className="flex items-center gap-2 border-b border-white h-[60px] pl-4 cursor-pointer"
                  onClick={() => setActiveComponent("winCondition")}
                >
                  <GiPodiumWinner />
                  Win Conditon
                  <div />
                </div>
                <div
                  className="flex items-center gap-2 border-b border-white h-[60px] pl-4 cursor-pointer"
                  onClick={() => setActiveComponent("Court")}
                >
                  <GiTennisCourt />
                  Court
                </div>
              </div>
            )}
            <li
              className={`flex items-center gap-2 menu-span cursor-pointer ${
                active ? "bg-[#033987]" : ""
              }`}
              onClick={() => toggleActiveNews()}
            >
              <IoNewspaperOutline />
              News
            </li>
            <li onClick={() => handleSignOut()} className="cursor-pointer">
              Sign Out
            </li>
          </ul>
        </div>
      </div>
      <div className="manager-content">{renderComponent()}</div>
    </div>
  );
};
export default Manager;
