import { Button } from "./Button";
import { TiHeartOutline } from "react-icons/ti";

export const LikeBtn = ({
    postItself,
    myself,
    likedOrNot,
    setLikedOrNot,
    handleNumOfLikes,
}) => {
    const likePost = async (postsId, myId) => {
        console.log("in like functhis is the post", postItself);
        // make a fetch- request- call post, pass the posts id and my id in the request params- end point will find the post and update its likes.count to be +1 and it's list to have my ID!!
        if (postItself.likes.list.includes(myId))
            return console.log(
                "we are doing nothing because you already liked this post",
            );
        // if i already liked this post- DO NOTHING!
        const newLikesObject = JSON.stringify({
            count: (postItself.likes.count + 1),
            list: (postItself.likes.list + myId),
        });
        const options = {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                likes: {
                    count: postItself.likes.count + 1,
                    list: postItself.likes.list + myId,
                },
            }),
        };
        try {
            const resp = await fetch(
                `http://localhost:5000/posts/likeAPost/${postsId}/${myId}`,
                options,
            );
            const data = await resp.json();
            console.log(data);
            setLikedOrNot(true);
        } catch (error) {
            console.error("there was a frontend error with liking this post", {
                error: error.message,
            });
        }
        return;
    };
    // console.log(myself);
    return (
        <Button
            handleClick={() => {
                likePost(postItself?._id, myself?._id);
                handleNumOfLikes();
            }}
            btnText={
                <span className="likeBox text-3xl">
                    <span>
                        <TiHeartOutline />
                    </span>
                </span>
            }
        />
    );
};
