import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "./Button";
import { FaCheckDouble } from "react-icons/fa6";

export const UnfollowBtn = ({ them, me, onHandleFollowState }) => {
    const [whoIAm, setWhoIAm] = useState(me);

    const handleUnfollow = async (them) => {
        const options = {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                myUpdatedList: {
                    count: me.following.list.includes(them._id)
                        ? whoIAm.following.count > 1
                            ? (whoIAm.following.count -= 1)
                            : 0
                        : "",

                    list: me.following.list.includes(them._id)
                        ? whoIAm.following.list
                              .split(" ")
                              .filter((id) => id !== them._id)
                              .join(" ")
                        : "",
                },
                theirUpdatedFollowers: {
                    count: them.followers.list.includes(me._id)
                        ? them.followers.count > 1
                            ? (them.followers.count -= 1)
                            : 0
                        : "",
                    // otherwise^ set their count to minus ONE bc we were already following them and now we arent!
                    list: them.followers.list.includes(me._id)
                        ? them.followers.list
                              .split(" ")
                              .filter((id) => id !== whoIAm._id)
                              .join(" ")
                        : "",
                    // otherwise make their list- what it already is without my included
                },
            }),
        };
        try {
            const response = await fetch(
                `http://localhost:5000/unFollowSomeone/${whoIAm._id}/${them._id}`,
                options,
            );
            const data = await response.json();
            console.log("data", data);
            localStorage.removeItem("loggedInIndividual");
            localStorage.setItem(
                "loggedInIndividual",
                JSON.stringify(data.newMe),
            );
            setWhoIAm(data.newMe);
            console.log(
                "new you in storage",
                JSON.parse(localStorage.getItem("loggedInIndividual")),
            );
            console.log(data);
        } catch (error) {
            console.error("there was an error with unfollowing", error);
        }
    };
    return (
        <Button
            styles={"bg-pink-500"}
            btnText={
                <>
                    <FaCheckDouble className="text-lg" />
                    Unfollow
                </>
            }
            handleClick={() => {
                handleUnfollow(them);
                onHandleFollowState();
            }}
        />
    );
};
