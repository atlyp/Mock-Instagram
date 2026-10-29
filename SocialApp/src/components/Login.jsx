import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggingInState, signSomeoneIn } from "../redux/social";
import { useNavigate } from "react-router";
export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();
    const { loggingInState } = useSelector((state) => state.socialKey);
    const dispatch = useDispatch();

    const handleInfo = (e, func) => {
        const whatWasTyped = e.target.value;
        return func(whatWasTyped);
    };

    const databaseLogin = async (e) => {
        e.preventDefault();
        const resp = await fetch("http://localhost:5000/loggingIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        const data = await resp.json();
        console.log(data.data, "the user");
        if (data.data[0]) {
            // if there is no error^
            localStorage.setItem(
                "loggedInIndividual",
                JSON.stringify(data.data[0]),
            );
            dispatch(signSomeoneIn(data.data[0]));
            navigate("/dashboard", { state: { user: data.data[0] } });
            // navigate to dashboard and pass the user as state
        } else {
            return alert("No User Found");
            // otherwise give us the error
        }
    };

    return (
        <>
            <section className="authSection bg-neutral-primary">
                <div className="authLayout mx-auto">
                    <div className="authIntro flex flex-col justify-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tighter text-heading md:text-5xl lg:text-6xl">
                            Good people. Good moments. Stay connected.
                        </h1>
                        <p className="mb-8 text-base font-normal text-body md:text-xl">
                            Share the little moments, meet your people, and keep up with the ones who matter.
                        </p>
                        <a
                            href="#"
                            className="text-fg-brand hover:underline font-medium text-lg inline-flex items-center"
                        >
                            A place for your people
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
                                onSubmit={(e) => databaseLogin(e)}
                                method="POST"
                            >
                                <h2 className="text-heading">Welcome back</h2>
                                <div className="mb-4">
                                    <label
                                        htmlFor="username"
                                        className="block mb-2.5 text-sm font-medium text-heading"
                                    >
                                        Your username
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            handleInfo(e, setUsername)
                                        }
                                        type="text"
                                        id="username"
                                        className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                        placeholder="@yourusername"
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
                                        onChange={(e) =>
                                            handleInfo(e, setPassword)
                                        }
                                        type="password"
                                        id="password"
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
                                    Login to your account
                                </button>
                                <div className="text-sm font-medium text-body">
                                    Not registered?{" "}
                                    <a
                                        onClick={() =>
                                            dispatch(
                                                setLoggingInState(
                                                    !loggingInState,
                                                ),
                                            )
                                        }
                                        href="#"
                                        className="text-fg-brand hover:underline"
                                    >
                                        Create account
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
