import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { StatusCard } from "../components/StatusCard";
import { AccountStat } from "../components/AccountStat";

export const ViewUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location);
    const [thisId, setThisId] = useState(null);
    const [theUser, setTheUser] = useState(null);
    const [thisUsersPosts, setThisUsersPosts] = useState(null);
    const getThisUsersPosts = async (id) => {
        try {
            const resp = await fetch(
                `http://localhost:5000/posts/getThisUsersPosts/${id}`,
            );
            const data = await resp.json();
            console.log(data);
            setThisUsersPosts(data.data.reverse());
            setTheUser(data.theUser[0]);
        } catch (error) {
            console.error("there was an error getting this users posts");
        }
    };
    useEffect(() => {
        setThisId(location.state.userViewed || location.state.user);
    }, []);
    useEffect(() => {
        getThisUsersPosts(thisId);
    }, [thisId]);
    console.log(theUser);
    console.log(thisUsersPosts);
    const followers = theUser?.followers.count;
    const following = theUser?.following.count;
    return (
        <div className="pt-20 dark:text-white ">
            <h1 className="font-bold text-5xl ">@{theUser?.username}</h1>
            <span className="accountStats my-5">
                <a
                    className="cursor-pointer"
                    onClick={() =>
                        navigate("/ViewFollowers", { state: { user: theUser } })
                    }
                >
                    <AccountStat
                        statLabel={"Followers"}
                        actualStat={followers}
                    />
                </a>
                <a
                    className="cursor-pointer"
                    onClick={() =>
                        navigate("/ViewFollowing", { state: { user: theUser } })
                    }
                >
                    <AccountStat
                        actualStat={following}
                        statLabel={"Following"}
                    />
                </a>
                <AccountStat
                    statLabel={"Posts"}
                    actualStat={thisUsersPosts?.length}
                />
            </span>
            <div className="theirPosts w-full flex flex-col items-center">
                {thisUsersPosts?.map((post) => {
                    return (
                        <StatusCard
                            post={post}
                            key={post._id}
                            dateTimeCreated={new Date(post.createdAt)}
                            content={post.body}
                            author={theUser.username}
                            title={post.title}
                            user={theUser}
                            styles={"m-[6rem]"}
                        ></StatusCard>
                    );
                })}
            </div>
        </div>
    );
};
