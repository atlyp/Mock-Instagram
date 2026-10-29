import React, { useEffect, useState } from "react";
import { CardEl } from "./CardEl";
import { Button } from "./Button";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";

export const Posts = () => {
    const [posts, setPosts] = useState(null);
    const { userLoggedInCurrently } = useSelector((state) => state.socialKey);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const resp = await fetch("http://localhost:5000/posts/getAllPosts");
                if (!resp.ok) throw new Error("Could not load posts.");
                const data = await resp.json();
                setPosts(data.posts ?? []);
            } catch (error) {
                console.error("There was an error getting posts", error);
                setPosts([]);
            }
        };
        void fetchPosts();
    }, []);
    const postsByYou = posts?.filter(
        (post) => post.userId == userLoggedInCurrently._id,
    );
    // console.log(postsByYou, userLoggedInCurrently._id);
    const handleDeletePost = async (id) => {
        try {
            const options = { method: "delete" };
            const resp = await fetch(
                `http://localhost:5000/posts/deletePost/${id}`,
                options,
            );
            if (!resp.ok) throw new Error("Could not delete the post.");
            window.location.reload();
        } catch (error) {
            console.error("There was an error deleting the post", error);
        }
    };

    return (
        <main className="postsContainer">
            <h1 className="postsHeading">Your posts</h1>
            {postsByYou?.length
                ? [...postsByYou].reverse().map((post) => (
                      <CardEl
                          key={post._id}
                          title={post.title}
                          content={post.body}
                          styles="postCard"
                      >
                          <span className="containerForLikeButtons">
                              {post.likes.count} like
                              {post.likes.count == 1 ? "" : "s"}
                          </span>
                          <Button
                              btnText={<FaTrash />}
                              handleClick={() => handleDeletePost(post._id)}
                          />
                      </CardEl>
                  ))
                : posts === null
                  ? <p className="postsEmpty">Loading your posts…</p>
                  : <p className="postsEmpty">You haven’t shared a post yet. Tap the create button to get started.</p>}
        </main>
    );
};
