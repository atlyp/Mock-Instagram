import { useEffect, useRef, useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "./Button";
const inputTheme = { border: "1px solid pink", borderRadius: "7px", margin:"0.4rem" };
export const BottomNav = () => {
  const [makingNewPost, setMakingNewPost] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { loggedIn, userLoggedInCurrently } = useSelector(
    (state) => state.socialKey,
  );
  // console.log(userLoggedInCurrently);
  const navigate = useNavigate();
  const formRef = useRef();
  const newPostDivRef = useRef();

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
      const data = await response.json();
      // console.log(data);
      navigate("/Dashboard", { state: { user: userLoggedInCurrently } });
      window.location.reload();
    } catch (error) {
      console.error("There was an error", error);
    }
  };

  const handleModalShow = (e) => {
    console.log(e.target);
    console.log(newPostDivRef);
    if (e.target == newPostDivRef.current) {
      setMakingNewPost(!makingNewPost);
    }
  };
  return (
    <>
      <div
        className="
            bg-gray-300 dark:bg-gray-700 bottomNav bottom-0 z-1 "
      >
        <FaPenToSquare
          className=" m-1
                    dark:bg-pink-500 dark:text-black
                    bg-white text-pink-500
                     text-5xl rounded p-[2.5px]"
          onClick={() => setMakingNewPost(!makingNewPost)}
        />
      </div>

      {makingNewPost ? (
        <>
          <div className=" flex-col w-[50%] fixed z-2 top-[40%] left-[20%] h-fit">
            <form
              ref={formRef}
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
              <span className="labelInputSpan flex flex-col w-[50%]">
                <label className="text-center" htmlFor="title">Title??</label>
                <input
                style={inputTheme}
                  placeholder="My posts title"
                  type="text"
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </span>
              <span className="labelInputSpan flex flex-col w-[50%]">
                <label className="text-center" htmlFor="body">Have Something To Say?🗣️</label>
                <textarea
                style={inputTheme}
                  type="text"
                  placeholder="Type Away . . ."
                  id="body"
                  onChange={(e) => setBody(e.target.value)}
                />
              </span>
              {/* <button type="submit">Post</button> */}
              <Button styles={"text-xl"} btnType={"submit"} btnText={"Post"} />
            </form>
          </div>
          <div
            ref={newPostDivRef}
            onClick={(e) => handleModalShow(e)}
            className={`bg-black w-full h-[100vh] newPostModal fixed opacity-10 top-0 ${makingNewPost ? "flex" : "hidden"}`}
          ></div>{" "}
        </>
      ) : (
        ""
      )}
    </>
  );
};
