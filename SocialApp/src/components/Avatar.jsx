import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogOut } from "../redux/social";
import { useNavigate } from "react-router";
export const Avatar = ({ whatTheUserJustCliked }) => {
    const { userLoggedInCurrently, loggedIn } = useSelector(
        (state) => state.socialKey,
    );
    // reading global states "userLoggedInCurrently", "loggedIn" from redux
    const [avatarDropdownShow, setAvatarDropdownShow] = useState(false);
    // state to track whether or not the dropdown within this component was showing!
    const dispatch = useDispatch();
    // this is how we call global state functions to change the state in redux
    let navigate = useNavigate();
    // naviagte a 
    const handleLogOut = () => {
        dispatch(setLogOut());
        // console.log(loggedIn);
        // console.log(userLoggedInCurrently, "is logged in");
        localStorage.removeItem("loggedInIndividual");
        navigate("/");
        setAvatarDropdownShow(false);
    };

    // useEffect(() => {
    //     const avatarCircleForInitial =
    //         avatarDropdownRef?.current?.previousElementSibling;
    //     const avatarInitialItself =
    //         avatarDropdownRef?.current?.previousElementSibling?.lastElementChild;
    //     const theyClickedAvatar = (el) => {
    //      return el == avatarCircleForInitial || avatarInitialItself
    //     }
    //     if (
    //         avatarDropdownRef?.current !== whatTheUserJustCliked &&
    //         avatarCircleForInitial !== whatTheUserJustCliked &&
    //         avatarDropdownShow == true
    //     ) {
    //         setAvatarDropdownShow(!avatarDropdownShow);
    //     }
    // }, [whatTheUserJustCliked]);
    const avatarDropdownRef = useRef();
    // console.dir(avatarDropdownRef.current);
    // console.log("this is what was clicked", whatTheUserJustCliked);
    return (
        <>
            {userLoggedInCurrently.username !== undefined ? (
                <>
                    <div
                        className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-neutral-tertiary rounded-full"
                        onClick={() => {
                            setAvatarDropdownShow(!avatarDropdownShow);
                        }}
                    >
                        <div
                            id="tooltip-user"
                            role="tooltip"
                            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-dark rounded-base shadow-xs opacity-0 tooltip"
                        >
                            {`${userLoggedInCurrently.username}`}
                            <div
                                className="tooltip-arrow"
                                data-popper-arrow
                            ></div>
                        </div>
                        <span
                            data-tooltip-target="tooltip-user"
                            className="font-medium text-body cursor-pointer"
                        >
                            {userLoggedInCurrently.image ? (
                                <img
                                    src={userLoggedInCurrently.image}
                                    alt={`An image for ${userLoggedInCurrently.username}`}
                                />
                            ) : (
                                userLoggedInCurrently.email[0]
                            )}
                        </span>
                    </div>
                    <div
                        ref={avatarDropdownRef}
                        id="userDropdown"
                        className={`z-10 absolute ${avatarDropdownShow ? "" : "hidden"} bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44 top-13 right-19`}
                    >
                        <div className="px-4 py-3 border-b border-default-medium text-sm text-heading">
                            <div className="font-medium">{`${userLoggedInCurrently.username}`}</div>
                            <div className="truncate">{`${userLoggedInCurrently.email}`}</div>
                        </div>
                        <ul
                            className="p-2 text-sm text-body font-medium"
                            aria-labelledby="avatarButton"
                        >
                            <li>
                                <a
                                    href="#"
                                    className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                                >
                                    Change Profile Picture
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                                >
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                                >
                                    Earnings
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={handleLogOut}
                                    href="#"
                                    className="block w-full p-2 hover:bg-neutral-tertiary-medium text-fg-danger rounded-md"
                                >
                                    Sign out
                                </a>
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                ""
            )}
        </>
    );
};
