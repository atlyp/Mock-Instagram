import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { NavbarEl } from "../components/NavbarEl";
import { useEffect } from "react";
import { useState } from "react";

export const About = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log("location", location);
    const [person, setPerson] = useState(null);
    const { userLoggedInCurrently } = useSelector((state) => state.socialKey);
    console.log(userLoggedInCurrently);
    const loggedInPerson = userLoggedInCurrently;

    const user = location.state?.user || loggedInPerson;
    console.log(userLoggedInCurrently);
    const { age, company, phone, university } = user;
    useEffect(() => {
        setPerson(localStorage.getItem("loggedInIndividual"));
    }, []);
    return (
        <div className="dark:text-white">
            <a
                onClick={() =>
                    navigate("/ViewFollowers", { state: { user: user } })
                }
            >
                <h2>Followers:{userLoggedInCurrently.followers?.count}</h2>
            </a>
            <h2>Following: {userLoggedInCurrently.following?.count}</h2>
            About
            <div>
                <span>
                    <h1 className="text-4xl">
                        Welcome back {`${user?.firstName || user.email} !!`}
                    </h1>
                </span>

                <section>
                    <h2 className="text-2xl"> About you:</h2>
                    <span>
                        Employment: You work as a {`${user.company?.title}`}
                        <span>
                            {" "}
                            in the {`${user.company?.department}`} Department.
                        </span>
                        <br />
                        at {`${user.company?.name}`} Inc.
                    </span>
                    <br />
                    <p>
                        Phone: {phone}
                        <br />
                        College: {university}
                    </p>
                </section>
            </div>
        </div>
    );
};
