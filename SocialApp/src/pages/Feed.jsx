import React, { useEffect, useState } from "react";
import { StatusCard } from "../components/StatusCard";


export const Feed = () => {
    const [posts, setPosts] = useState(null);
    const whoImFollowing = JSON.parse(
        localStorage.getItem("loggedInIndividual"),
    )?.following?.list;
    console.log("who i follow", whoImFollowing);

    const getPostsOfWhoIfollow = async (whoImFollowing) => {
        try {
            const resp = await fetch(
                `http://localhost:5000/posts/myFeed/${whoImFollowing}`,
            );
            // REMMEBER to change the endpoint logic- so we aren't grabbing every post
            const data = await resp.json();
            // console.log(data);
            setPosts(data.yourFeed);
        } catch (error) {
            console.error("front end error getting your feed");
        }
    };

    useEffect(() => {
        getPostsOfWhoIfollow(whoImFollowing);
    }, []);
    const postsOfWhoIFollow =
        posts &&
        posts.filter((post) => {
            return whoImFollowing?.includes(post.userId) ? post : "";
        });

    return (
        <div className="mb-5 dark:text-white flex-col flex items-center">
            {postsOfWhoIFollow ? (
                <span className="text-5xl">Your feed</span>
            ) : (
                ""
            )}
            {postsOfWhoIFollow &&
                postsOfWhoIFollow.reverse().map((post) => {
                    const timeAndDayItWasCreated = new Date(post.createdAt);

                    return (
                        <StatusCard
                            post={post}
                            key={post._id}
                            user={post.userId}
                            id={post.userId}
                            styles={"m-[5rem]"}
                            title={post.title}
                            content={post.body}
                            author={post.author}
                            dateTimeCreated={timeAndDayItWasCreated}
                        ></StatusCard>
                    );
                })}
            {!postsOfWhoIFollow?.length ? "You don't follow anybody!" : ""}
        </div>
    );
};
