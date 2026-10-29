import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { CardEl } from "../components/CardEl";
import { FollowBtns } from "../components/FollowBtns";
import { LoadingSpinner } from "../components/LoadingSpinner";
export const SearchUsers = () => {
    const [personSearched, setPersonSearched] = useState("");
    const [allUsers, setAllUsers] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    
    let [personIAm, setPersonIAm] = useState({});
    const searchInputRef = useRef();
    const getMe = async (id) => {
        console.log("this function happened");
        const resp = await fetch(`http://localhost:5000/getMe/${id}`);
        const data = await resp.json();
        console.log(data.data[0]);
        setPersonIAm(data.data[0]);
    };
    const navigate = useNavigate();
    useEffect(() => {
        setPersonIAm(location.state.user);
    }, []);
    useEffect(() => {
        if (personIAm?._id) {
            getMe(personIAm._id);
        }
    }, [personSearched]);
    const handleSearch = (name) => {
        if (personSearched == "") return setAllUsers(null);
        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/findUser/${name}`,
                );
                const data = await response.json();
                // console.log(data);
                setAllUsers(data.usersFound);
                setLoading(false);
            } catch (error) {
                console.error("there was an error", error);
                setLoading(false);
            }
        }, 1350);
    };
    useEffect(() => {
        handleSearch(personSearched);
    }, [personSearched]);

    const handlePerson = async (e) => {
        return setPersonSearched(e.target.value.toLowerCase());
    };
    const handleFollow = async (them) => {
        console.log("this is who you'd like to follow", them);
        const options = {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                myUpdatedList: {
                    count: personIAm.following.list.includes(them._id)
                        ? personIAm.following.count
                        : (personIAm.following.count += 1),

                    list: personIAm.following.list.includes(them._id)
                        ? personIAm.following.list
                        : (personIAm.following.list += ` ${them._id}`),
                },
                theirUpdatedFollowers: {
                    count: them.followers.list.includes(personIAm._id)
                        ? // if i am already following them
                          them.followers.count
                        : // return their count- don't do anything to the number
                          (them.followers.count+= 1),
                    // otherwise^ set their count to plus ONE bc we weren't already following them and now we are!
                    list: them.followers.list.includes(personIAm._id)
                        ? them.followers.list
                        : // check if their list already in cludes me-
                          // if i am already following this user- do nothing
                          (them.followers.list += ` ${personIAm._id}`),
                    // otherwise make their list- what it already is PLUS my id included
                },
            }),
        };
        try {
            const response = await fetch(
                `http://localhost:5000/followSomeone/${personIAm._id}/${them._id}`,
                options,
            );
            const data = await response.json();
            console.log("data", data);
            localStorage.removeItem("loggedInIndividual");
            localStorage.setItem(
                "loggedInIndividual",
                JSON.stringify(data.newMe),
            );
            setPersonIAm(data.newMe);
            console.log(
                "new you in storage",
                JSON.parse(localStorage.getItem("loggedInIndividual")),
            );
            console.log(data);
        } catch (error) {
            console.error("there was an error with following", error);
        }
    };
    const handleViewUser = (user) => {
        navigate("/ViewUser", { state: { user: user._id } });
    };
    return (
        <main className="searchPage">
            <h1>Find your people</h1>
            <input placeholder="Type in a UserName"
                ref={searchInputRef}
                className="dark:text-black rounded-lg mt-5 userSearchInput dark:bg-gray-700 dark:text-white"
                type="text"
                onChange={(e) => handlePerson(e)}
            />
            {!loading ? (
                allUsers &&
                allUsers.map((user) => {
                    const amFollowing = personIAm?.following?.list.includes(
                        user._id,
                    ) ? true
                        : false;
                    console.log(amFollowing);
                    const thisIsMe = user?._id == personIAm?._id ? true : false;
                    return (
                        <CardEl
                            styles={"m-3"}
                            title={
                                <>
                                    <a
                                        className="cursor-pointer"
                                        onClick={() => handleViewUser(user)}
                                    >
                                        {"@" +
                                            user.username +
                                            (thisIsMe ? " (you)" : "")}
                                    </a>
                                </>
                            }
                        >
                            <span className="dark:text-white">
                                {" "}
                                {user.following.list.includes(personIAm?._id)
                                    ? "(follows you)"
                                    : ""}
                            </span>

                            {!thisIsMe ? (
                                <FollowBtns
                                    followLogic={() => handleFollow(user)}
                                    followingThisPerson={amFollowing}
                                    thePerson={user}
                                    myself={personIAm}
                                />
                            ) : (
                                ""
                            )}
                        </CardEl>
                    );
                })
            ) : (
                <span className=" flex items-center ml-3 mt-3">
                    <LoadingSpinner /> <h1 className="text-pink-500">Loading . . .</h1>
                </span>
            )}
            <br />
            {!allUsers?.length && personSearched && !loading
                ? <span className="text-5xl block m-6 text-pink-500">

                    No User Found!
                </span>
                : ""}
        </main>
    );
};
