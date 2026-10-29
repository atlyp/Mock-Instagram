import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { CardEl } from "../components/CardEl.jsx";
import { handleViewUser } from "../utils/handleViewUser.js";

export const ViewFollowers = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location);
    const { userLoggedInCurrently } = useSelector((state) => state.socialKey);
    const [theFollowers, setTheFollowers] = useState([]);
    const getMyFollowers = async (theFollowers) => {
        theFollowers = theFollowers?.split(" ").join("-");
        try {
            const resp = await fetch(
                `http://localhost:5000/getMyFollowersOrWhoFollowsMe/${theFollowers}`,
            );
            const data = await resp.json();
            console.log(data);
            setTheFollowers(data.result);
        } catch (error) {
            console.log("there was an error getting your followers");
        }
    };
    const personViewed = location.state.user;
    useEffect(() => {
        getMyFollowers(personViewed.followers.list);
    }, []);

    return (
        <div className=" dark:text-white p-3 ">
            <h1 className="text-5xl dark:text-pink-500 italic font-extrabold m-2">
                @{personViewed.username}'s{" "}
            </h1>
            <span className="text-4xl dark:text-pink-500 dark:border-white">
                Followers:
            </span>
            <span className="w-[70%] rounded-4xl p-1 block border-black dark:border-white border-dotted border-[3px] ">
                {theFollowers?.map((user) => {
                    return (
                        <CardEl
                            pointer={true}
                            styles={"m-3 w-min shadow-3xl"}
                            handleClick={() =>
                                handleViewUser(user._id, navigate)
                            }
                            // we pass the Id because in this function that is what we use to navigate and fetch the user- we fetch by the ID or the user themselves
                            title={user.username}
                        ></CardEl>
                    );
                })}
            </span>
        </div>
    );
};
