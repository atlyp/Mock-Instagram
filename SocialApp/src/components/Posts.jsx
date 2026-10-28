import React, { useEffect, useState } from "react";
import jsonPosts from "../assets/posts.json";
import { CardEl } from "./CardEl";
import { Button } from "./Button";
import { FaThumbsUp } from "react-icons/fa6";
import { FaThumbsDown } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { FaTrash } from "react-icons/fa";

export const Posts = () => {
    const [posts, setPosts] = useState(null);
    const { userLoggedInCurrently } = useSelector((state) => state.socialKey);
    const location = useLocation();
    const loggedInPerson = userLoggedInCurrently;
    const user = location.state?.user || loggedInPerson;
    // console.log(user);
    // console.log(location);
    const fetchPosts = async () => {
        try {
            const resp = await fetch("http://localhost:5000/posts/getAllPosts");
            const data = await resp.json();
            // console.log(data.posts);
            setPosts(data.posts);
        } catch (error) {
            // console.log("there was an error", error);
        }
    };
    useEffect(() => {
        // location.state.user = user;
        fetchPosts();
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
            const data = await resp.json();
            // console.log(data);
            window.location.reload();
        } catch (error) {
            // console.log(error);
        }
    };

    return (
        <div className="postsContainer dark:text-white text-6xl">
            {postsByYou?.length ? "Your Posts" : "You haven't posted anything."}
            {postsByYou?.length
                ? postsByYou?.reverse()?.map((post) => {
                      return (
                          <>
                              <CardEl
                                  key={post._id}
                                  title={post.title}
                                  content={post.body}
                              >
                                  <span className="containerForLikeButtons">
                                      {post.likes.count} like
                                      {post.likes.count == 1 ? "" : "s"}
                                  </span>
                                  <Button
                                      btnText={<FaTrash />}
                                      handleClick={() =>
                                          handleDeletePost(post._id)
                                      }
                                  />
                              </CardEl>
                          </>
                      );
                  })
                : ""}
        </div>
    );
};
