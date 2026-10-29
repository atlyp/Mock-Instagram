import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setWhoSignedUp,
  setLoggedIn,
  setLoggingInState,
  loggingInState,
} from "../redux/social";
import { useNavigate } from "react-router";

export const SignUp = () => {
  const { ourUsers, loggedIn } = useSelector((state) => state.socialKey);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const setInfo = (event, change) => {
    const whatWasTyped = event.target.value;
    change(whatWasTyped);
  };

  const handleUserSIgnUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });
      console.log("we are inside our handle test user add");
      const data = await response.json();
      console.log("what came from end point", data.data);

      if (!data.success) return alert(data.message);
      // ^ send our data to the DB and try to become a user- if we get an error then alert us
      else {
        // if no error- toggle signed in state and remember who was signed in
        dispatch(setWhoSignedUp(data.data));
        localStorage.setItem(
          "loggedInIndividual",
          JSON.stringify(data.data),
        );
        console.log(data);
        navigate("/dashboard", { state: { user: data.data } });
      }
      console.log(data);
      return;
    } catch (error) {
      console.log("front-end error", error);
    }
  };

  return (
    <>
      <section className="authSection bg-neutral-primary">
      <div className="authLayout mx-auto">
        <div className="authIntro flex flex-col justify-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tighter text-heading md:text-5xl lg:text-6xl">
              Find your people.
            </h1>
            <p className="mb-8 text-base font-normal text-body md:text-xl">
              Share what you love, find your community, and keep the people in your life close.
            </p>
            <a
              href="#"
              className="text-fg-brand hover:underline font-medium text-lg inline-flex items-center"
            >
              Your next favorite corner of the internet
              <svg
                className="w-6 h-6 rtl:rotate-180 ms-1.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </a>
          </div>
          <div>
            <div className="authCard w-full">
              <form
                method="POST"
                onSubmit={(e) =>
                  handleUserSIgnUp(e, email, password, username)
                }
              >
                <h2 className="text-heading">Create your account</h2>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Choose a Username
                  </label>
                  <input
                    onChange={(e) => setInfo(e, setUsername)}
                    type="username"
                    id="username"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="JohnDoe999"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Enter email
                  </label>
                  <input
                    onChange={(e) => setInfo(e, setEmail)}
                    type="email"
                    id="email"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="example@company.com"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="confirmEmail"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Confirm your email
                  </label>
                  <input
                    onChange={(e) => setInfo(e, setConfirmEmail)}
                    type="confirmEmail"
                    id="confirmEmail"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="example@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Your password
                  </label>
                  <input
                    onChange={(e) => setInfo(e, setPassword)}
                    type="password"
                    id="password"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="•••••••••"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Confirm password
                  </label>
                  <input
                    onChange={(e) => setInfo(e, setConfirmPassword)}
                    type="password"
                    id="confirmPassword"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="•••••••••"
                    required
                  />
                </div>
                <div className="flex items-start my-6">
                  <div className="flex items-center">
                    <input
                      id="checkbox-remember"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                    />
                    <label
                      htmlFor="checkbox-remember"
                      className="ms-2 text-sm font-medium text-heading"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="ms-auto text-sm font-medium text-fg-brand hover:underline"
                  >
                    Lost Password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3"
                >
                  Sign Up
                </button>
                <div className="text-sm font-medium text-body">
                  Have an account with us?{" "}
                  <a
                    onClick={() => dispatch(setLoggingInState(!loggingInState))}
                    href="#"
                    className="text-fg-brand hover:underline"
                  >
                    Login!
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
