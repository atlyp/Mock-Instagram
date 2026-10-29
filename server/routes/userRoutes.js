import express from "express";
import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcrypt";

import User from "../models/User.js";
// grabbing the user model- this is how we  enable data base queries- how our routes acces our user data- this connect our API to mongoDB
const router = express.Router();
const passwordSaltRounds = 12;
const isBcryptHash = (password) =>
    typeof password === "string" && /^\$2[aby]\$\d{2}\$/.test(password);
const legacyPasswordMatches = (password, storedPassword) => {
    if (typeof storedPassword !== "string") return false;

    const passwordBuffer = Buffer.from(password, "utf8");
    const storedPasswordBuffer = Buffer.from(storedPassword, "utf8");
    return (
        passwordBuffer.length === storedPasswordBuffer.length &&
        timingSafeEqual(passwordBuffer, storedPasswordBuffer)
    );
};

// ^ this keeps the password out of every user response- even after we hash it
const withoutPassword = (user) => {
    if (!user) return user;

    const safeUser = user.toObject ? user.toObject() : { ...user };
    delete safeUser.password;
    return safeUser;
};

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
    // creating a variable to ask the database for users and mongo db returns us all users-
    res.json({
        success: true,
        message: "Here are your users",
        data: users.map(withoutPassword),
    });
    // sends a json http response
    /**
     * Simple explanation 1: The server sends data back.
Simple explanation 2: React receives the user list.
Simple explanation 3: The frontend can display it.
     */
});
router.get("/getMe/:id", async (req, res) => {
    const me = await User.find({ _id: req.params.id });
    res.json({ data: me.map(withoutPassword) });
});
router.get("/findUser/:name", async (req, res) => {
    const { name } = req.params;
    try {
        let allPeople = await User.find();
        allPeople = allPeople.filter((person) => {
            const username = person.username;

            if (username.toLowerCase().includes(name.toLowerCase())) {
                return person;
            }
        });
        res.json({
            usersFound: allPeople.map(withoutPassword),
            success: true,
            message: "users found !",
        });
    } catch (error) {
        console.error("There was an error retrieving users", error);
        res.status(500).json({
            message: "error retrieving users",
            success: false,
        });
    }
});
router.get("/populateUsers", async (req, res) => {
    console.log("populate us users endpoint hit");
    // console.log(usersFromJSON);
    const usersToInsert = await Promise.all(
        usersFromJSON.users.map(async (user) => {
            if (
                typeof user.password !== "string" ||
                !user.password ||
                Buffer.byteLength(user.password, "utf8") > 72
            ) {
                throw new Error("Seed users need a password up to 72 bytes.");
            }

            return {
                ...user,
                password: isBcryptHash(user.password)
                    ? user.password
                    : await bcrypt.hash(user.password, passwordSaltRounds),
            };
        }),
    );
    await User.insertMany(usersToInsert);
    const users = await User.find();
    // console.log(users);
    res.json({
        succes: true,
        data: users.map(withoutPassword),
        message: "Stored a bunch of users",
    });
});
router.delete("/delete", async (req, res) => {
    // get method is meant to recieve data without changing state of the server- delete is MEANT to change the state of the database
    try {
        await User.deleteMany();

        const users = await User.find();
        res.json({
            message: "users were deleted",
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("There was an error deleting users", error);
        res.status(500).json({
            success: false,
            message: "There was an error deleting users.",
        });
    }

    // ^how we delete from the database
});
router.post("/signUp", async (req, res) => {
    const { email, password, username } = req.body ?? {};
    if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof username !== "string" ||
        !username.trim() ||
        typeof password !== "string" ||
        !password ||
        Buffer.byteLength(password, "utf8") > 72
    ) {
        return res.status(400).json({
            success: false,
            message: "Enter a username, email, and a password up to 72 bytes.",
        });
    }

    try {
        // ^ bcrypt turns the password into a one-way hash before it goes in the database
        const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);
        const newUser = new User({
            username: username.trim(),
            email: email.trim(),
            password: hashedPassword,
            followers: {
                count: 0,
                list: "",
            },
            following: {
                count: 0,
                list: "",
            },
        });

        await newUser.save();
        res.json({
            success: true,
            message: "Successfully created an account!",
            data: withoutPassword(newUser),
        });
    } catch (error) {
        console.error("There was an error signing up", error);
        res.status(500).json({
            success: false,
            message: "There was an error creating your account.",
        });
    }
});
router.post("/loggingIn", async (req, res) => {
    const { username, password } = req.body ?? {};
    if (
        typeof username !== "string" ||
        !username.trim() ||
        typeof password !== "string" ||
        !password ||
        Buffer.byteLength(password, "utf8") > 72
    ) {
        return res.status(400).json({
            success: false,
            message: "Enter a username and password.",
            data: [],
        });
    }

    try { 
        const thatUser = await User.findOne({
            username: username.trim(),
        });
        if (!thatUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password.",
                data: [],
            });
        }

        const storedPassword = thatUser.password;
        const storedPasswordIsHash = isBcryptHash(storedPassword);
        const passwordMatches = storedPasswordIsHash
            ? await bcrypt.compare(password, storedPassword)
            : legacyPasswordMatches(password, storedPassword);
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password.",
                data: [],
            });
        }

        if (!storedPasswordIsHash) {
            // ^ old accounts used to save the password as-is- hash it when they next log in
            thatUser.password = await bcrypt.hash(password, passwordSaltRounds);
            await thatUser.save();
        }

        res.json({
            success: true,
            message: "Successfully logged in",
            data: [withoutPassword(thatUser)],
        });
    } catch (error) {
        console.error("There was an error logging in", error);
        res.status(500).json({
            success: false,
            message: "There was an error logging in.",
            data: [],
        });
    }
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
        res.json({
            success: true,
            newMe: withoutPassword(newMe),
            newThem: withoutPassword(newThem),
        });
    } catch (error) {
        console.error("There was an error following", error);
        res.status(500).json({
            success: false,
            message: "There was an error following.",
        });
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
            newMe: withoutPassword(newMe),
            newthem: withoutPassword(newThem),
        });
    } catch (error) {
        console.error("There was an error unfollowing", error);
        res.status(500).json({
            success: false,
            message: "There was an error unfollowing.",
        });
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
