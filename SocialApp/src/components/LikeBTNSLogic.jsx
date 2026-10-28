import React, { useEffect, useState } from "react";
import { LikeBtn } from "./LikeBtn";
import { DislikeBtn } from "./DislikeBtn";
import { useSelector } from "react-redux";

export const LikeBTNSLogic = ({ thePostItself, likesQntty, setLikesQntty }) => {
    const [postIsLiked, setPostIsLiked] = useState(false);
    const { userLoggedInCurrently } = useSelector((state) => state.socialKey);
    // console.log(userLoggedInCurrently);
    const me = userLoggedInCurrently;
    // console.log(me);
    useEffect(() => {
        // if ()
        if (thePostItself?.likes?.list.includes(me._id)) {
            setPostIsLiked(true);
        } else {
            setPostIsLiked(false);
        }
    }, []);
    // console.log(me)
    const handleNumOfLikes = (action) => {
        if (action == "decrement") {
            setLikesQntty((prev) => prev - 1);
        } else {
            setLikesQntty((prev) => prev + 1);
        }
    };
    return (
        <>
            {!postIsLiked ? (
                // if we haven't liked this post yet
                <LikeBtn
                    handleNumOfLikes={() => handleNumOfLikes("increment")}
                    likedOrNot={postIsLiked}
                    setLikedOrNot={setPostIsLiked}
                    myself={me}
                    postItself={thePostItself}
                />
            ) : (
                <DislikeBtn
                    handleNumOfLikes={() => handleNumOfLikes("decrement")}
                    likedOrNot={postIsLiked}
                    setLikedOrNot={setPostIsLiked}
                    myself={me}
                    postItself={thePostItself}
                />
            )}
        </>
    );
};
