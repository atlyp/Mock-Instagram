import { useNavigate } from "react-router";
import { LikeBTNSLogic } from "./LikeBTNSLogic";
import { useState } from "react";
import { handleViewUser } from "../utils/handleViewUser";

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
            <br />
            {likes} like{likes == 1 ? "" : "s"}
            <br />
            <time className="postMeta datetimespan" dateTime={postedAt.toISOString()}>
                {wasPostedToday
                    ? `Today at ${timeItWasCreated}`
                    : `${dateItWasCreated} at ${timeItWasCreated}`}
            </time>
        </article>
    );
};
