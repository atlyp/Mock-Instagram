import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Posts } from "./Posts";
import { NavbarEl } from "./NavbarEl";
import { useEffect } from "react";
export const Dashboard = () => {
    const location = useLocation();
    console.log(location);
    let navigate = useNavigate();
    const { userLoggedInCurrently } = useSelector((state) => state.socialKey);
    const loggedInPerson = userLoggedInCurrently;
    const user = location.state?.user || loggedInPerson;
    useEffect(() => {
        loggedInPerson.username ? "" : navigate("/");
    }, []);
    // const
    return (
        <>
            
            <Posts />
        </>
    );
};
