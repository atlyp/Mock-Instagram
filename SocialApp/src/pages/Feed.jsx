import React, { useEffect, useState } from "react";
import { StatusCard } from "../components/StatusCard";


export const Feed = () => {
    const [posts, setPosts] = useState(null);
    const whoImFollowing = JSON.parse(
        localStorage.getItem("loggedInIndividual"),
    )?.following?.list;
    console.log("who i follow", whoImFollowing);

    useEffect(() => {
        let isCurrent = true;
        const getPostsOfWhoIfollow = async () => {
            try {
                const resp = await fetch(
                    `http://localhost:5000/posts/myFeed/${whoImFollowing}`,
                );
                if (!resp.ok) throw new Error("Could not load your feed.");
                const data = await resp.json();
                if (isCurrent) setPosts(data.yourFeed ?? []);
            } catch (error) {
                console.error("There was an error getting your feed", error);
                if (isCurrent) setPosts([]);
            }
        };
        void getPostsOfWhoIfollow();

        return () => {
            isCurrent = false;
        };
    }, [whoImFollowing]);
    const postsOfWhoIFollow =
        posts &&
        posts.filter((post) => {
            return whoImFollowing?.includes(post.userId) ? post : "";
        });

    return (
        <main className="feedPage dark:text-white">
            <h1 className="feedHeading">Your feed</h1>
            {postsOfWhoIFollow &&
                [...postsOfWhoIFollow].reverse().map((post) => {
                    const timeAndDayItWasCreated = new Date(post.createdAt);

                    return (
                        <StatusCard
                            post={post}
                            key={post._id}
                            user={post.userId}
                            id={post.userId}
                            title={post.title}
                            content={post.body}
                            author={post.author}
                            dateTimeCreated={timeAndDayItWasCreated}
                        ></StatusCard>
                    );
                })}
            {postsOfWhoIFollow?.length === 0 ? (
                <p className="feedEmpty">
                    Your feed is quiet for now. Follow people to see their posts here.
                </p>
            ) : null}
            {posts === null ? <p className="feedEmpty">Loading your feed…</p> : null}
        </main>
    );
};
