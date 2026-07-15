import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Login } from "../components/Login";
import { SignUp } from "../components/signUp";
import { useLocation, useNavigate } from "react-router";
import { NavbarEl } from "../components/NavbarEl";

export const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loggedIn, loggingInState } = useSelector(
        (state) => state.socialKey,
    );
    const [personLoggedIn, setPersonLoggedin] = useState(null);
    console.log(loggedIn);
    useEffect(() => {
         const personLoggedIn = JSON.parse(
            localStorage.getItem("loggedInIndividual"),
        );
        if (personLoggedIn) {
    setPersonLoggedin(personLoggedIn)
        
    }
}, [])
    useEffect(() => {
       
        loggedIn
            ? navigate("dashboard", { state: { user: personLoggedIn } })
            : "";
        // if someone is logged always bring us to the dashboard
    }, [personLoggedIn]);
    return (
        <>
            {!loggedIn && loggingInState ? <Login /> : <SignUp />}
            {/* if noone is logged in and somebody IS trying to log in - show us the login component, otherwise show us the sign up component */}
            {/* Home */}
        </>
    );
};
