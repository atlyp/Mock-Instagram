import { useState } from "react";
import {
    FaHouse,
    FaMagnifyingGlass,
    FaPenToSquare,
    FaPlus,
    FaRss,
    FaUser,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "./Button";

export const BottomNav = () => {
    const [makingNewPost, setMakingNewPost] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const { userLoggedInCurrently } = useSelector((state) => state.socialKey);
    const navigate = useNavigate();

    const handlePostCreate = async (id, dataWeAreSending, e) => {
        e.preventDefault();
        const options = {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataWeAreSending),
        };
        try {
            const response = await fetch(
                `http://localhost:5000/posts/createAPost/${id}`,
                options,
            );
            if (!response.ok) {
                throw new Error("The post could not be created.");
            }
            navigate("/Dashboard", { state: { user: userLoggedInCurrently } });
            window.location.reload();
        } catch (error) {
            console.error("There was an error creating your post", error);
        }
    };

    const goTo = (path) =>
        navigate(path, { state: { user: userLoggedInCurrently } });

    return (
        <>
            <nav className="mobileBottomNav" aria-label="Main navigation">
                <button type="button" aria-label="Home" onClick={() => goTo("/Dashboard")}>
                    <FaHouse aria-hidden="true" />
                </button>
                <button type="button" aria-label="Your feed" onClick={() => goTo("/Feed")}>
                    <FaRss aria-hidden="true" />
                </button>
                <button
                    type="button"
                    className="createPostNavButton"
                    aria-label="Create a post"
                    onClick={() => setMakingNewPost(true)}
                >
                    <FaPlus aria-hidden="true" />
                </button>
                <button type="button" aria-label="Search users" onClick={() => goTo("/Search")}>
                    <FaMagnifyingGlass aria-hidden="true" />
                </button>
                <button type="button" aria-label="Your profile" onClick={() => goTo("/About")}>
                    <FaUser aria-hidden="true" />
                </button>
            </nav>
            <button
                type="button"
                className="desktopCreateButton"
                aria-label="Create a post"
                onClick={() => setMakingNewPost(true)}
            >
                <FaPenToSquare aria-hidden="true" />
            </button>

            {makingNewPost ? (
                <>
                    <button
                        type="button"
                        className="newPostOverlay"
                        aria-label="Close create post form"
                        onClick={() => setMakingNewPost(false)}
                    />
                    <section
                        className="newPostDialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-post-title"
                    >
                        <h2 id="create-post-title" className="text-xl font-semibold">
                            Create a post
                        </h2>
                        <form
                            onSubmit={(e) =>
                                handlePostCreate(
                                    userLoggedInCurrently._id,
                                    {
                                        title,
                                        body,
                                        author: userLoggedInCurrently.username,
                                        likes: { count: 0, list: "" },
                                    },
                                    e,
                                )
                            }
                            method="post"
                            className="newPostForm opacity-100 rounded-2xl p-2 "
                        >
                            <span className="labelInputSpan flex flex-col">
                                <label htmlFor="title">Add a title</label>
                                <input
                                    placeholder="What’s this post about?"
                                    type="text"
                                    id="title"
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </span>
                            <span className="labelInputSpan flex flex-col">
                                <label htmlFor="body">Your caption</label>
                                <textarea
                                    placeholder="Share a little more..."
                                    id="body"
                                    required
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </span>
                            <Button
                                styles="w-full justify-center text-base"
                                btnType="submit"
                                btnText="Share post"
                            />
                        </form>
                    </section>
                </>
            ) : (
                ""
            )}
        </>
    );
};
