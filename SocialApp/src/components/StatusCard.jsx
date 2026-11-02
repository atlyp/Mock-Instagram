import { useNavigate } from "react-router";
import { LikeBTNSLogic } from "./LikeBTNSLogic";
import { useState } from "react";
import { handleViewUser } from "../utils/handleViewUser";
import { apiUrl } from "../config/api";

export const StatusCard = ({
    title,
    content,
    children,
    author,
    dateTimeCreated,
    styles,
    user,
    post,
}) => {
    const navigate = useNavigate();
    const [likes, setLikes] = useState(post?.likes?.count ?? 0);
    const [likers, setLikers] = useState([]);
    const [showLikers, setShowLikers] = useState(false);
    const [likersLoading, setLikersLoading] = useState(false);
    const [likersError, setLikersError] = useState("");
    const postedAt = new Date(dateTimeCreated);
    const now = new Date();
    const wasPostedToday =
        postedAt.getFullYear() === now.getFullYear() &&
        postedAt.getMonth() === now.getMonth() &&
        postedAt.getDate() === now.getDate();
    const timeItWasCreated = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
    }).format(postedAt);
    const dateItWasCreated = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
    }).format(postedAt);
    const viewUser = () => handleViewUser(user, navigate);

    const toggleLikers = async () => {
        if (showLikers) {
            setShowLikers(false);
            return;
        }

        setShowLikers(true);
        if (likers.length || !post?._id) return;

        setLikersLoading(true);
        setLikersError("");
        try {
            const response = await fetch(
                apiUrl(`/posts/getPostLikes/${encodeURIComponent(post._id)}`),
            );
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not load post likes.");
            }
            setLikers(data.likers);
        } catch (error) {
            console.error("There was an error loading post likes", error);
            setLikersError("Could not load the people who liked this post.");
        } finally {
            setLikersLoading(false);
        }
    };

    return (
        <article className={`postCard ${styles ?? ""}`}>
            <h4 className="postAuthor clickViewAccount">
                <button type="button" onClick={viewUser}>@{author}</button>
            </h4>{" "}
            <h5 className="postTitle">
                <span className="dark:text-white italic">- {title} </span>
            </h5>
            <p className="postContent">{content}</p>
            {children}
            <LikeBTNSLogic
                likeQntty={likes}
                setLikesQntty={setLikes}
                thePostItself={post}
            />
            <button
                type="button"
                className="postLikesLink"
                onClick={toggleLikers}
                aria-expanded={showLikers}
                aria-controls={`post-likers-${post?._id}`}
                disabled={!post?._id}
            >
                {likes} like{likes === 1 ? "" : "s"}
            </button>
            {showLikers && (
                <section
                    id={`post-likers-${post?._id}`}
                    className="postLikers"
                    aria-label="People who liked this post"
                >
                    <h3>Liked by</h3>
                    {likersLoading && <p>Loading people…</p>}
                    {likersError && <p role="alert">{likersError}</p>}
                    {!likersLoading && !likersError && likers.length === 0 && (
                        <p>No likes yet.</p>
                    )}
                    {likers.length > 0 && (
                        <ul>
                            {likers.map((liker) => (
                                <li key={liker._id}>
                                    <button
                                        type="button"
                                        onClick={() => handleViewUser(liker, navigate)}
                                    >
                                        {liker.image ? (
                                            <img
                                                src={liker.image}
                                                alt=""
                                                className="postLikerAvatar"
                                            />
                                        ) : (
                                            <span className="postLikerAvatar postLikerInitial">
                                                {(liker.username?.[0] || "?").toUpperCase()}
                                            </span>
                                        )}
                                        <span>@{liker.username}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
            <br />
            <time className="postMeta datetimespan" dateTime={postedAt.toISOString()}>
                {wasPostedToday
                    ? `Today at ${timeItWasCreated}`
                    : `${dateItWasCreated} at ${timeItWasCreated}`}
            </time>
        </article>
    );
};
