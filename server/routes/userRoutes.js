import express from "express";

import User from "../models/User.js";
// grabbing the user model- this is how we  enable data base queries- how our routes acces our user data- this connect our API to mongoDB
const router = express.Router();

// ^creating a mini server handling user related routes
// ^this will later attach to the main app- it handles grouped routes

import usersFromJSON from "../../SocialApp/src/assets/users.json" with { type: "json" };
// ^ type is needed in order for this file to come in here
// console.log(usersFromJSON);

router.get("/", async (req, res) => {
    console.log("plain '/' was hit");
    /**
Code explanation 1: Defines a GET endpoint.
Code explanation 2: Path / relative to router mount.
Code explanation 3: Async callback allows database queries.

Simple explanation 1: This creates an endpoint.
Simple explanation 2: React can request all users.
Simple explanation 3: The server will respond with data. */

    const users = await User.find();
    console.log(users, "are our users");
    // creating a variable to ask the database for users and mongo db returns us all users-
    res.json({ success: true, message: "Here are your users", data: users });
    // sends a json http response
    /**
     * Simple explanation 1: The server sends data back.
Simple explanation 2: React receives the user list.
Simple explanation 3: The frontend can display it.
     */
});
router.get("/getMe/:id", async (req, res) => {
    const me = await User.find({ _id: req.params.id });
    res.json({ data: me });
});
router.get("/findUser/:name", async (req, res) => {
    const { name } = req.params;
    try {
        let allPeople = await User.find();
        allPeople = allPeople.filter((person) => {
            const username = person.username;

            if (username.toLowerCase().includes(name)) {
                return person;
            }
        });
        res.json({
            usersFound: allPeople,
            success: true,
            message: "users found !",
        });
    } catch (error) {
        res.status(404).json({
            message: "error retrieving users",
            success: false,
        });
    }
});
router.get("/populateUsers", async (req, res) => {
    console.log("populate us users endpoint hit");
    // console.log(usersFromJSON);
    await User.insertMany(usersFromJSON.users);
    const users = await User.find();
    // console.log(users);
    res.json({ succes: true, data: users, message: "Stored a bunch of users" });
});
router.delete("/delete", async (req, res) => {
    // get method is meant to recieve data without changing state of the server- delete is MEANT to change the state of the database
    try {
        await User.deleteMany();

        const users = await User.find();
        console.log("these are our users", users);
        res.json({
            message: "users were deleted",
            success: true,
            data: users,
        });
    } catch (error) {
        console.log("there was an error with deleting users from our DB");
    }

    // ^how we delete from the database
});
router.post("/signUp", async (req, res) => {
    console.log("signup endpoint was hit");
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    console.log("sign up endpoint was hit");
    try {
        const newUser = new User({
            username,
            email,
            password,
            followers: {
                count: 0,
                list: "",
            },
            following: {
                count: 0,
                list: "",
            },
        });
        console.log("the new user variable in rh", newUser);

        await newUser.save();
        res.json({
            success: true,
            message: "Successfully created an account!",
            data: newUser,
        });
    } catch (error) {
        console.log("there was an error with signing up", error);
        res.json({
            success: false,
            message: "Error- we are now inside catch block",
        });
    }
});
router.post("/loggingIn", async (req, res) => {
    const username = req.body.username;
    const passw = req.body.password;
    console.log(username, passw);
    try { 
        const thatUser = await User.find({
            username: username,
            password: passw,
        });
        console.log(thatUser);

        res.json({
            success: true,
            message: "Succesfully logged in",
            data: thatUser,
        });
    } catch (error) {
        res.json({ succes: false, message: "there was an error logging in" });
    }

    console.log("logging in endpoint was hit");
});

router.put("/followSomeone/:myId/:theirId", async (req, res) => {
    const { myId, theirId } = req.params;
    const updatedLists = req.body;
    // console.log("this is the request params", req.params);

    try {
        const newMe = await User.findByIdAndUpdate(
            myId,
            {
                following: updatedLists.myUpdatedList,
            },
            { returnDocument: "after" },
        );
        const newThem = await User.findByIdAndUpdate(
            theirId,
            {
                followers: updatedLists.theirUpdatedFollowers,
            },
            { returnDocument: "after" },
        );
        await newMe.save();
        await newThem.save();
        res.json({ success: true, newMe: newMe, newThem: newThem });
    } catch (error) {
        console.error("There was an error following", error);
        res.json({ success: false, error: error });
    }
});
router.put("/unFollowSomeone/:myId/:theirId", async (req, res) => {
    const { myId, theirId } = req.params;
    const updatedLists = req.body;
    try {
        const newMe = await User.findByIdAndUpdate(
            myId,
            {
                following: updatedLists.myUpdatedList,
            },
            { returnDocument: "after" },
        );
        const newThem = await User.findByIdAndUpdate(
            theirId,
            {
                followers: updatedLists.theirUpdatedFollowers,
            },
            { returnDocument: "after" },
        );
        await newMe.save();
        await newThem.save();
        console.log(updatedLists);
        res.status(202).json({
            success: true,
            message: "successfully unfollowed",
            newMe: newMe,
            newthem: newThem,
        });
    } catch (error) {
        res.json({ error: `this is the errrror ${error}` });
        console.error("there wa san error unfollowing", error);
    }
});
router.get("/getMyFollowersOrWhoFollowsMe/:theirIds", async (req, res) => {
    let { theirIds } = req.params;
    console.log("the followers or followings ids", theirIds);
    try {
        const allUsers = await User.find({}, "username email ObjectId");
        console.log("all users", allUsers);

        const them = allUsers.filter((user) => {
            if (theirIds.includes(user._id)) {
                return user;
            }
        });
        console.log("these are your followers", them);

        res.json({
            result: them,
            success: true,
            message: "here are your followers",
        });
    } catch (error) {
        console.error("there was an error getting your followers");
        res.status(504).json({ error: error.message });
    }
});
export default router;
// Code explanation 1: Exports the router object.
// Code explanation 2: Allows importing into the main server file.
// Code explanation 3: ES module default export syntax.

// Simple explanation 1: This shares the routes.
// Simple explanation 2: The main server will use them.
// Simple explanation 3: It connects everything together.
