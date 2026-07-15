import { useNavigate } from "react-router";
import { LikeBTNSLogic } from "./LikeBTNSLogic";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

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
    const { userLoggedInCurrently } = useSelector((state) => state.socialKey);
    const me = userLoggedInCurrently;
    const [likes, setLikes] = useState(0);
    useEffect(() => {
        setLikes(post?.likes?.count);
    }, []);

    // date control!
    const amOrPm = dateTimeCreated.getHours() >= 12 ? "PM" : "AM";
    const hours =
        dateTimeCreated.getHours() == 0 ? 12 : dateTimeCreated.getHours();
    const minutes = `${dateTimeCreated.getMinutes() < 10 ? `0${dateTimeCreated.getMinutes()}` : dateTimeCreated.getMinutes()}`;
    const timeItWasCreated = `${hours > 12 ? hours - 12 : hours}:${minutes} ${amOrPm}`;

    // console.log(dateTimeCreated);
    const dateOfPost = dateTimeCreated.toJSON().split("T")[0];
    // console.log(dateOfPost);
    console.log(dateOfPost);
    const date = Temporal.PlainDate.from(dateOfPost);
    console.log(date);
    const now = Temporal.Now.plainDateISO();
    // console.log(date, now);
    const duration = now.since(date, { smallestUnit: "weeks" });
    const formatter = new Intl.DurationFormat("en-US", { style: "long" });
    const howLongAgo = formatter.format(duration);
    // console.log(`It's been ${formatter.format(duration)} since that day...`);
    const wasPostedToday = howLongAgo == "-1 day";
    // date control^!
    return (
        <div
            className={`bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-lg ${styles} mb-4 dark:text-white`}
        >
            <h4 className="cursor-pointer w-min p-1 text-xl clickViewAccount hover:font-bold hover:text-3xl hover:text-pink-500 font-[inter-italic]">
                <a onClick={() => handleViewUser(user, navigate)}>@{author}</a>
            </h4>{" "}
            says
            <h5 className="mb-3 text-xl font-semibold tracking-tight text-heading leading-8 flex">
                <span className="dark:text-white italic">- {title} </span>
            </h5>
            <p className="text-body mb-6 text-3xl">"{content}"</p>
            {children}
            <LikeBTNSLogic
                likeQntty={likes}
                setLikesQntty={setLikes}
                thePostItself={post}
            />
            <br />
            {likes} like{likes == 1 ? "" : "s"}
            <br />
            <span className="datetimespan">
                {wasPostedToday ? "" : `at ${timeItWasCreated}`}
                <br />
                {wasPostedToday
                    ? `Today at ${timeItWasCreated}`
                    : howLongAgo + " ago"}
            </span>
        </div>
    );
};
export const handleViewUser = (user, handleNav) => {
    console.log(user);

    localStorage.removeItem("userViewed");
    localStorage.setItem("userViewed", JSON.stringify(user));
    // const personViewed = JSON.parse(localStorage.getItem("userViewed"))
    handleNav("/ViewUser", {
        state: { ...location.state, userViewed: user },
    });
};
