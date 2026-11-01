import React, { useState } from "react";
import { Avatar } from "./Avatar";
import { NotificationBell } from "./NotificationBell";
import { useDispatch, useSelector } from "react-redux";
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { FaMoon, FaSun } from "react-icons/fa6";
import { setDarkMode } from "../redux/social";

export const NavbarEl = () => {
     const [dropdown, setDropdown] = useState(false);
     const [avatarDropdown, setAvatarDropdown] = useState(false);
     const handleDropdown = () => {
          setDropdown((isOpen) => !isOpen);
          setAvatarDropdown(false);
     };
     const handleAvatarToggle = () => {
          setAvatarDropdown((isOpen) => !isOpen);
          setDropdown(false);
     };
     const closeMenus = () => {
          setDropdown(false);
          setAvatarDropdown(false);
     };
     const { loggedIn, userLoggedInCurrently, darkMode } = useSelector((state) => state.socialKey);
     // console.log(userLoggedInCurrently);
     const dispatch = useDispatch();
     let navigate = useNavigate();

     const handleDMode = () => {
          dispatch(setDarkMode(!darkMode));
          localStorage.setItem("darkMode", JSON.stringify(!darkMode));
     };
     return (
          <nav
               className="navbarEl bg-neutral-primary fixed left-0 top-0 z-20 w-full border-b border-default"
          >
               <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a
                         onClick={() => {
                              loggedIn
                                   ? navigate("/dashboard", {
                                          state: { user: userLoggedInCurrently },
                                     })
                                   : navigate("/");
                              closeMenus();
                         }}
                         className="navbarBrand flex items-center space-x-3 rtl:space-x-reverse"
                    >
                         <FaMobileScreenButton className="bg-linear-[25deg,orange_20%,hotpink_60%,purple_110%] text-5xl rounded-2xl text-black dark:text-white" />
                         <span className="self-center text-3xl text-heading font-semibold whitespace-nowrap">
                              JunoSocial
                         </span>
                    </a>
                    <button
                         type="button"
                         onClick={handleDMode}
                         className="navbarThemeToggle"
                         aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                         aria-pressed={darkMode}
                    >
                         {darkMode ? (
                              <FaSun className="dModeBtn cursor-pointer dark:text-white" aria-hidden="true" />
                         ) : (
                              <FaMoon className="dModeBtn cursor-pointer" aria-hidden="true" />
                         )}
                    </button>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                         {loggedIn && userLoggedInCurrently?._id && (
                              <NotificationBell userId={userLoggedInCurrently._id} />
                         )}
                         {loggedIn && userLoggedInCurrently?._id ? (
                              <Avatar
                                   isOpen={avatarDropdown}
                                   onToggle={handleAvatarToggle}
                                   onClose={closeMenus}
                              />
                         ) : ""}
                         {/* <!-- Dropdown menu --> */}

                         <button
                              onClick={handleDropdown}
                              data-collapse-toggle="navbar-user"
                              type="button"
                              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
                              aria-controls="navbar-user"
                              aria-expanded={dropdown}
                              aria-label={dropdown ? "Close navigation menu" : "Open navigation menu"}
                         >
                              <span className="sr-only">Open main menu</span>
                              <svg
                                   className="w-6 h-6"
                                   aria-hidden="true"
                                   xmlns="http://www.w3.org/2000/svg"
                                   width="24"
                                   height="24"
                                   fill="none"
                                   viewBox="0 0 24 24"
                              >
                                   <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeWidth="2"
                                        d="M5 7h14M5 12h14M5 17h14"
                                   />
                              </svg>
                         </button>
                    </div>
                    <div
                         className={`items-center justify-between ${dropdown ? "" : "hidden"} w-full md:flex md:w-auto md:order-1`}
                         id="navbar-user"
                    >
                         <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
                              <li>
                                   <a
                                        onClick={() => {
                                             loggedIn
                                                  ? navigate("/dashboard", {
                                                         state: {
                                                              user: userLoggedInCurrently,
                                                         },
                                                    })
                                                  : navigate("/");
                                             closeMenus();
                                        }}
                                        href="#"
                                        className="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0"
                                        aria-current="page"
                                   >
                                        Home
                                   </a>
                              </li>
                              <li>
                                   <a
                                        onClick={() => {
                                             loggedIn ? navigate("/About", {}) : navigate("/LearnMore");

                                             closeMenus();
                                        }}
                                        href="#"
                                        className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                                   >
                                        About
                                   </a>
                              </li>
                              {loggedIn ? (
                                   <>
                                        {/* only show us your feed and search users options, if someone is logged in */}
                                        <li>
                                             <a
                                                  onClick={() => {
                                                       navigate("/Feed", {
                                                            state: {
                                                                 user: userLoggedInCurrently,
                                                            },
                                                       });
                                                       closeMenus();
                                                  }}
                                                  className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent cursor-pointer"
                                             >
                                                  Your Feed
                                             </a>
                                        </li>
                                        <li>
                                             <a
                                                  onClick={() => {
                                                       loggedIn
                                                            ? navigate("/Search", {
                                                                   state: {
                                                                        user: userLoggedInCurrently,
                                                                   },
                                                              })
                                                            : navigate("/");
                                                       closeMenus();
                                                  }}
                                                  className="cursor-pointer block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                                             >
                                                  Search Users
                                             </a>
                                        </li>
                                   </>
                              ) : (
                                   ""
                              )}
                              <li>
                                   <a
                                        href="#"
                                        className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                                   >
                                        Contact
                                   </a>
                              </li>
                         </ul>
                    </div>
               </div>
          </nav>
     );
};
