import express from "express";
const router = express.Router();

import Post from "../models/Post.js";
// we need to grab the post model- so we can access the mongoDB collection
import User from "../models/User.js";
import Notification from "../models/Notification.js";

import jsonPosts from "../../SocialApp/src/assets/posts.json" with { type: "json" };

router.get("/getThisUsersPosts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        console.log("this is the id", id);
        const theirPosts = await Post.find({ userId: id });
        const theUser = await User.find({ _id: id });
        res.json({
            success: true,
            data: theirPosts,
            theUser: theUser,
            message: "here ya go",
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "coulnd't find your posts",
        });
        console.error("error finding your posts", error);
    }
});

router.get("/getAllPosts", async (req, res) => {
    // await Post.insertMany(jsonPosts.posts);
    const allPosts = await Post.find();
    // console.log(allPosts, "are all the posts");
    res.send({ posts: allPosts });
});

router.post("/createAPost/:id", async (req, res) => {
    const { id } = req.params;
    const postCreated = req.body;
    // console.log(postCreated);
    try {
        const createdPost = new Post({ ...postCreated, userId: id });
        console.log(createdPost);
        await createdPost.save();
        res.status(200).json({
            success: true,
            message: "succesfully created post",
            data: createdPost,
        });
    } catch (error) {
        res.status(404).json({
            message: "there was an error posting",
            success: false,
        });
    }
});
router.delete("/deletePost/:postId", async (req, res) => {
    const { postId } = req.params;
    console.log(postId);
    try {
        await Post.findByIdAndDelete(postId);
        res.status(200).json({
            success: true,
            message: "successfully deleted post",
        });
    } catch (error) {
        console.error("there was an error", error);
        res.status(404).json({
            success: false,
            message: "there was an error deleting post",
        });
    }
});
router.get("/myFeed/:whoImFollowing", async (req, res) => {
    const { whoImFollowing } = req.params;
    try {
        const allPosts = await Post.find({});
        const yourFeedPosts = allPosts.filter((post) =>
            whoImFollowing.includes(post.userId),
        );
        console.log("what the people you follow posted", yourFeedPosts);
        res.status(201).json({ yourFeed: yourFeedPosts });
    } catch (error) {
        console.error("backend error getting your feed", error);
    }
});
router.put("/likeAPost/:postsId/:myId", async (req, res) => {
    const { postsId, myId } = req.params;
    const updatedLikes = req.body;
    console.log(req.body);
    try {
        const postBeforeLike = await Post.findById(postsId);
        if (!postBeforeLike) {
            return res.status(404).json({
                success: false,
                message: "Post not found.",
            });
        }
        const alreadyLiked = String(postBeforeLike.likes?.list ?? "").includes(
            myId,
        );
        const postAfterWeLikedIt = await Post.findByIdAndUpdate(
            postsId,
            {
                likes: updatedLikes.likes,
            },
            { returnDocument: "after" },
        );
        await postAfterWeLikedIt.save();
        if (!alreadyLiked && postBeforeLike.userId !== myId) {
            const actor = await User.findById(myId);
            if (actor) {
                await Notification.create({
                    recipientId: postBeforeLike.userId,
                    actorId: myId,
                    actorUsername: actor.username || "Someone",
                    type: "like",
                    postId: postsId,
                    postTitle: postBeforeLike.title || "",
                });
            }
        }
        console.log(postAfterWeLikedIt.likes);
        res.status(203).json({
            success: true,
            message: "succesfully liked post",
            likedPost: postAfterWeLikedIt,
        });
    } catch (error) {
        console.log("there was a backend error with liking this post");
        res.status(504).json({
            success: false,
            message: "ther eas an error liking your post",
            error: error.message,
        });
    }
});
router.put("/unlikeAPost/:postsId", async (req, res) => {
    const { postsId } = req.params;
    const updatedLikes = req.body;
    try {
        const postAfterUnliked = await Post.findByIdAndUpdate(
            postsId,
            { likes: updatedLikes.likes },
            { returnDocument: "after" },
        );
        await postAfterUnliked.save();
        console.log(postAfterUnliked.likes);

        res.status(203).json({ success: true, data: postAfterUnliked });
    } catch (error) {
        console.log(
            "there was a backend error with unliking this post",
            error.message,
        );
        res.status(503).json({
            success: false,
            message: "there was a backend error with unliking this post",
        });
    }
});
export default router;
