import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { CardEl } from "../components/CardEl.jsx";
import { handleViewUser } from "../utils/handleViewUser.js";
import { apiUrl } from "../config/api";

export const ViewFollowing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location);
    const [whoIFollow, setWhoIFollow] = useState([]);
    const personViewed = location.state?.user;
    useEffect(() => {
        let isActive = true;
        const loadFollowing = async () => {
            const followingIds = personViewed?.following?.list
                ?.split(" ")
                .join("-");
            if (!followingIds) return;

            try {
                const resp = await fetch(
                    apiUrl(`/getMyFollowersOrWhoFollowsMe/${followingIds}`),
                );
                if (!resp.ok) throw new Error("Could not load following list.");
                const data = await resp.json();
                if (isActive) setWhoIFollow(data.result ?? []);
            } catch (error) {
                console.error("There was an error getting your following list", error);
            }
        };
        void loadFollowing();
        return () => {
            isActive = false;
        };
    }, [personViewed?.following?.list]);

    return (
        <div className=" dark:text-white p-3 ">
            <h1 className="text-5xl dark:text-pink-500 italic font-extrabold m-2">
                @{personViewed.username}{" "}
            </h1>
            <span className="text-4xl dark:text-pink-500 dark:border-white">
                FOLLOWS:
            </span>
            <span className="w-[70%] rounded-4xl p-1 block border-black dark:border-white border-dotted border-[3px] ">
                {whoIFollow?.map((user) => {
                    return (
                        <CardEl
                            key={user._id}
                            pointer={true}
                            styles={"m-3 w-min shadow-3xl"}
                            handleClick={() =>
                                handleViewUser(user, navigate)
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
