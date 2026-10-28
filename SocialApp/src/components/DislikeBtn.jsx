import React from "react";
import { Button } from "./Button";
import { TiHeartFullOutline } from "react-icons/ti";

export const DislikeBtn = ({
    postItself,
    myself,
    likedOrNot,
    setLikedOrNot,
    handleNumOfLikes,
}) => {
    const unlikePost = async (postId, myId) => {
        const options = {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                likes: {
                    count: (postItself.likes.count -= 1),
                    list: postItself.likes.list.replace(myId, ""),
                },
            }),
        };
        try {
            const resp = await fetch(
                `http://localhost:5000/posts/unlikeAPost/${postId}`,
                options,
            );
            const data = await resp.json();
            console.log(
                "what came back from the sevrer when we tried to unlike this post",
                data,
            );
            setLikedOrNot(false);
        } catch (error) {
            console.log(
                "there was a frontend error with unliking your post",
                error.message,
            );
        }
    };
    return (
        <Button
            handleClick={() => {
                unlikePost(postItself._id, myself?._id);
                handleNumOfLikes();
            }}
            btnText={
                <span className="likeBox text-3xl">
                    <span>
                        <TiHeartFullOutline />
                    </span>
                </span>
            }
        />
    );
};
