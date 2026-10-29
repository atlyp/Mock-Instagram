import express from "express";
// Use Express to define the API endpoints in this file.
import { timingSafeEqual } from "node:crypto";
// Use Node's constant-time comparison when checking older plain-text passwords.
import bcrypt from "bcrypt";
// Use bcrypt to hash new passwords and verify login attempts.

import User from "../models/User.js";
// Load the MongoDB user model so these routes can read and save accounts.
// grabbing the user model- this is how we  enable data base queries- how our routes acces our user data- this connect our API to mongoDB
const router = express.Router();
// Create a router so the main server can mount these user endpoints together.
const passwordSaltRounds = 12;
// Set bcrypt's work factor; higher work makes each password guess take longer.
const isBcryptHash = (password) =>
  // Start a helper that recognizes an already-hashed password.
  typeof password === "string" && /^\$2[aby]\$\d{2}\$/.test(password);
// This recognizes bcrypt's hash format so old plain-text passwords can be upgraded safely.
const legacyPasswordMatches = (password, storedPassword) => {
  // Start a helper to safely check accounts created before bcrypt was added.
  if (typeof storedPassword !== "string") return false;
  // A saved password that is not text cannot match, so reject it.

  const passwordBuffer = Buffer.from(password, "utf8");
  // Turn the entered password into bytes for a timing-safe comparison.
  const storedPasswordBuffer = Buffer.from(storedPassword, "utf8");
  // Turn the saved password into bytes in the same format for comparison.
  return (
    // Return this value to the code that called this function.
    passwordBuffer.length === storedPasswordBuffer.length &&
    // Check lengths first because timingSafeEqual requires same-sized values.
    timingSafeEqual(passwordBuffer, storedPasswordBuffer)
    // Compare both values without exposing how many characters matched.
  );
  // This closes the current block, call, or object.
};
// This closes the current block, call, or object.

// ^ this keeps the password out of every user response- even after we hash it
const withoutPassword = (user) => {
  // Start a helper that removes password data before a user is returned to the frontend.
  if (!user) return user;
  // If there is no user, leave the value alone rather than trying to edit it.

  const safeUser = user.toObject ? user.toObject() : { ...user };
  // Make a plain copy whether the user came from MongoDB or a regular object.
  delete safeUser.password;
  // Remove the password before user details are sent to the frontend.
  return safeUser;
  // Return this value to the code that called this function.
};
// This closes the current block, call, or object.

// ^creating a mini server handling user related routes
// ^this will later attach to the main app- it handles grouped routes

import usersFromJSON from "../../SocialApp/src/assets/users.json" with { type: "json" };
// Load the sample accounts used by the populate route below.
// ^ type is needed in order for this file to come in here
// console.log(usersFromJSON);

router.get("/", async (req, res) => {
  // GET / returns the user list for the frontend.
  console.log("plain '/' was hit");
  // Print this development information to the server console.
  /**
Code explanation 1: Defines a GET endpoint.
Code explanation 2: Path / relative to router mount.
Code explanation 3: Async callback allows database queries.

Simple explanation 1: This creates an endpoint.
Simple explanation 2: React can request all users.
Simple explanation 3: The server will respond with data. */

  const users = await User.find();
  // Fetch the current user records from MongoDB.
  // creating a variable to ask the database for users and mongo db returns us all users-
  res.json({
    // Send the route result as JSON so the frontend can read it.
    success: true,
    // Tell the frontend this request succeeded.
    message: "Here are your users",
    // Give the frontend a short description of the returned list.
    data: users.map(withoutPassword),
    // Return the users after removing each password.
  });
  // This closes the current block, call, or object.
  // sends a json http response
  /**
     * Simple explanation 1: The server sends data back.
Simple explanation 2: React receives the user list.
Simple explanation 3: The frontend can display it.
     */
});
// This closes the current block, call, or object.
router.get("/getMe/:id", async (req, res) => {
  // GET /getMe/:id looks up one account by its database ID.
  const me = await User.find({ _id: req.params.id });
  // Find the account whose MongoDB ID matches the URL.
  res.json({ data: me.map(withoutPassword) });
  // Send the route result as JSON so the frontend can read it.
});
// This closes the current block, call, or object.
router.get("/findUser/:name", async (req, res) => {
  // GET /findUser/:name searches account names using the text in the URL.
  const { name } = req.params;
  // Get the name text that the frontend wants to search for.
  try {
    // This starts work that can fail, such as a database or bcrypt operation.
    let allPeople = await User.find();
    // Fetch accounts so the route can find usernames matching the search.
    allPeople = allPeople.filter((person) => {
      // Keep only accounts whose usernames match the search.
      const username = person.username;
      // Read this account's username before comparing it with the search.

      if (username.toLowerCase().includes(name.toLowerCase())) {
        // Compare lowercase versions so search works regardless of capitalization.
        return person;
        // Return this value to the code that called this function.
      }
      // This closes the current block, call, or object.
    });
    // This closes the current block, call, or object.
    res.json({
      // Send the route result as JSON so the frontend can read it.
      usersFound: allPeople.map(withoutPassword),
      // Return matching accounts without exposing their passwords.
      success: true,
      // Tell the frontend this request succeeded.
      message: "users found !",
      // Tell the frontend the search returned matching accounts.
    });
    // This closes the current block, call, or object.
  } catch (error) {
    // This handles failures from the database or password work above.
    console.error("There was an error retrieving users", error);
    // Log the failure on the server so it can be diagnosed.
    res.status(500).json({
      // Tell the caller the server could not complete the request.
      message: "error retrieving users",
      // Give the frontend a short message when the search fails.
      success: false,
      // Tell the frontend this request failed.
    });
    // This closes the current block, call, or object.
  }
  // This closes the current block, call, or object.
});
// This closes the current block, call, or object.
router.get("/populateUsers", async (req, res) => {
  // GET /populateUsers adds the sample accounts from the JSON file.
  console.log("populate us users endpoint hit");
  // Print this development information to the server console.
  // console.log(usersFromJSON);
  const usersToInsert = await Promise.all(
    // Prepare all sample accounts and wait until their passwords are hashed.
    usersFromJSON.users.map(async (user) => {
      // Go through each sample account so its password can be checked and hashed before insertion.
      if (
        // This starts a validation check; any failed condition below returns an error before data is saved.
        typeof user.password !== "string" ||
        // A sample account needs a text password before it can be imported.
        !user.password ||
        // A sample account cannot be imported with a blank password.
        Buffer.byteLength(user.password, "utf8") > 72
        // Keep sample passwords within bcrypt's 72-byte limit.
      ) {
        // If any validation check above failed, send the error response below.
        throw new Error("Seed users need a password up to 72 bytes.");
        // This line supplies a value used by the surrounding route logic.
      }
      // This closes the current block, call, or object.

      return {
        // Return this value to the code that called this function.
        ...user,
        // Keep the sample account's other profile fields as they are.
        password: isBcryptHash(user.password)
          ? // Keep a sample password that is already hashed; hash plain-text ones below.
            user.password
          : // Reuse the existing bcrypt hash rather than hashing a hash again.
            await bcrypt.hash(user.password, passwordSaltRounds),
        // Hash a plain-text sample password before saving it.
      };
      // This closes the current block, call, or object.
    }),
    // Finish preparing this sample account, then move on to the next one.
  );
  // This closes the current block, call, or object.
  await User.insertMany(usersToInsert);
  // Save the prepared sample users, which now have hashed passwords, to MongoDB.
  const users = await User.find();
  // Fetch the current user records from MongoDB.
  // console.log(users);
  res.json({
    // Send the route result as JSON so the frontend can read it.
    succes: true,
    // Mark the sample-user response successful. (The existing response field spelling is preserved.)
    data: users.map(withoutPassword),
    // Return the users after removing each password.
    message: "Stored a bunch of users",
    // Confirm that the sample accounts were added.
  });
  // This closes the current block, call, or object.
});
// This closes the current block, call, or object.
router.delete("/delete", async (req, res) => {
    console.log("delete endpoint reached!!")
  // DELETE /delete removes all users from the database; keep this for controlled development use.
  // get method is meant to recieve data without changing state of the server- delete is MEANT to change the state of the database
  try {
    // This starts work that can fail, such as a database or bcrypt operation.
    await User.deleteMany();
    // Wait for this database or password operation to finish before continuing.

    const users = await User.find();
    // Fetch the current user records from MongoDB.
    res.json({
      // Send the route result as JSON so the frontend can read it.
      message: "users were deleted",
      // Confirm the users were deleted.
      success: true,
      // Tell the frontend this request succeeded.
      data: users,
      // Return the remaining users after the delete operation.
    });
    // This closes the current block, call, or object.
  } catch (error) {
    // This handles failures from the database or password work above.
    console.error("There was an error deleting users", error);
    // Log the failure on the server so it can be diagnosed.
    res.status(500).json({
      // Tell the caller the server could not complete the request.
      success: false,
      // Tell the frontend this request failed.
      message: "There was an error deleting users.",
      // Explain that the user deletion did not finish.
    });
    // This closes the current block, call, or object.
  }
  // This closes the current block, call, or object.

  // ^how we delete from the database
});
// This closes the current block, call, or object.
router.post("/signUp", async (req, res) => {
  // POST /signUp validates the new account details and saves the account.
  const { email, password, username } = req.body ?? {};
  // Read signup details; the empty object prevents missing request bodies from crashing the route.
  if (
    // This starts a validation check; any failed condition below returns an error before data is saved.
    typeof email !== "string" ||
    // Reject a missing or wrongly typed email before saving an account.
    !email.trim() ||
    // Reject an email made only of spaces.
    typeof username !== "string" ||
    // Reject a missing or wrongly typed username before using it.
    !username.trim() ||
    // Reject a username made only of spaces.
    typeof password !== "string" ||
    // Reject a missing or wrongly typed password before hashing it.
    !password ||
    // Reject an empty password.
    Buffer.byteLength(password, "utf8") > 72
    // bcrypt only checks the first 72 password bytes, so longer passwords are rejected instead of silently shortened.
  ) {
    // If any validation check above failed, send the error response below.
    return res.status(400).json({
      // Stop here and explain that the submitted information is invalid.
      success: false,
      // Tell the frontend this request failed.
      message: "Enter a username, email, and a password up to 72 bytes.",
      // Tell the user which signup fields are required and the password size limit.
    });
    // This closes the current block, call, or object.
  }
  // This closes the current block, call, or object.

  try {
    // This starts work that can fail, such as a database or bcrypt operation.
    // ^ bcrypt turns the password into a one-way hash before it goes in the database
    const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);
    // Hash the submitted password before it is saved; the original is not stored.
    const newUser = new User({
      // Build the new account record using the cleaned fields and hashed password.
      username: username.trim(),
      // Save the username without accidental spaces at the beginning or end.
      email: email.trim(),
      // Save the email without accidental spaces at the beginning or end.
      password: hashedPassword,
      // Save only the bcrypt hash, not the original password.
      followers: {
        // Start the new account's follower details.
        count: 0,
        // Start the new account's follower/following count at zero.
        list: "",
        // Start the new account's saved follower/following ID list empty.
      },
      // This is the next value in the object or list being built.
      following: {
        // Start the new account's following details.
        count: 0,
        // Start the new account's follower/following count at zero.
        list: "",
        // Start the new account's saved follower/following ID list empty.
      },
      // This is the next value in the object or list being built.
    });
    // This closes the current block, call, or object.

    await newUser.save();
    // Wait for this database or password operation to finish before continuing.
    res.json({
      // Send the route result as JSON so the frontend can read it.
      success: true,
      // Tell the frontend this request succeeded.
      message: "Successfully created an account!",
      // Tell the frontend the account was created successfully.
      data: withoutPassword(newUser),
      // Return the new account without exposing its password.
    });
    // This closes the current block, call, or object.
  } catch (error) {
    // This handles failures from the database or password work above.
    console.error("There was an error signing up", error);
    // Log the failure on the server so it can be diagnosed.
    res.status(500).json({
      // Tell the caller the server could not complete the request.
      success: false,
      // Tell the frontend this request failed.
      message: "There was an error creating your account.",
      // Explain that signup did not finish.
    });
    // This closes the current block, call, or object.
  }
  // This closes the current block, call, or object.
});
// This closes the current block, call, or object.
router.post("/loggingIn", async (req, res) => {
  // POST /loggingIn checks the username and password before returning the account.
  const { username, password } = req.body ?? {};
  // Read login details; the empty object lets validation handle a missing body.
  if (
    // This starts a validation check; any failed condition below returns an error before data is saved.
    typeof username !== "string" ||
    // Reject a missing or wrongly typed username before using it.
    !username.trim() ||
    // Reject a username made only of spaces.
    typeof password !== "string" ||
    // Reject a missing or wrongly typed password before hashing it.
    !password ||
    // Reject an empty password.
    Buffer.byteLength(password, "utf8") > 72
    // bcrypt only checks the first 72 password bytes, so longer passwords are rejected instead of silently shortened.
  ) {
    // If any validation check above failed, send the error response below.
    return res.status(400).json({
      // Stop here and explain that the submitted information is invalid.
      success: false,
      // Tell the frontend this request failed.
      message: "Enter a username and password.",
      // Tell the user that both login fields are required.
      data: [],
      // This is the next value in the object or list being built.
    });
    // This closes the current block, call, or object.
  }
  // This closes the current block, call, or object.

  try {
    // This starts work that can fail, such as a database or bcrypt operation.
    const thatUser = await User.findOne({
      // Find the login account by username; password checking happens after this lookup.
      username: username.trim(),
      // Save the username without accidental spaces at the beginning or end.
    });
    // This closes the current block, call, or object.
    if (!thatUser) {
      // If no account has this username, stop without checking or revealing anything else.
      return res.status(401).json({
        // Stop here without revealing whether the username or password was wrong.
        success: false,
        // Tell the frontend this request failed.
        message: "Invalid username or password.",
        // Use one message so the response does not disclose which login value was wrong.
        data: [],
        // This is the next value in the object or list being built.
      });
      // This closes the current block, call, or object.
    }
    // This closes the current block, call, or object.

    const storedPassword = thatUser.password;
    // Read the saved password value to decide how it needs to be checked.
    const storedPasswordIsHash = isBcryptHash(storedPassword);
    // Check whether this account already has a bcrypt hash.
    const passwordMatches = storedPasswordIsHash
      ? // Choose a hash check for newer accounts or a safe legacy check for older ones.
        await bcrypt.compare(password, storedPassword)
      : // For a hash, verify the password without trying to reverse the hash.
        legacyPasswordMatches(password, storedPassword);
    // For an older account, check its old password so a successful login can upgrade it.
    if (!passwordMatches) {
      // If the password is wrong, stop here and do not sign the account in.
      return res.status(401).json({
        // Stop here without revealing whether the username or password was wrong.
        success: false,
        // Tell the frontend this request failed.
        message: "Invalid username or password.",
        // Use one message so the response does not disclose which login value was wrong.
        data: [],
        // This is the next value in the object or list being built.
      });
      // This closes the current block, call, or object.
    }
    // This closes the current block, call, or object.

    if (!storedPasswordIsHash) {
      // Upgrade only old plain-text accounts; keep existing bcrypt hashes as they are.
      // ^ old accounts used to save the password as-is- hash it when they next log in
      thatUser.password = await bcrypt.hash(password, passwordSaltRounds);
      // Replace the old saved password with a bcrypt hash after verifying the login.
      await thatUser.save();
      // Save the upgraded password hash back to MongoDB.
    }
    // This closes the current block, call, or object.

    res.json({
      // Send the route result as JSON so the frontend can read it.
      success: true,
      // Tell the frontend this request succeeded.
      message: "Successfully logged in",
      // Tell the frontend the login succeeded.
      data: [withoutPassword(thatUser)],
      // Return the signed-in account without exposing its password.
    });
    // This closes the current block, call, or object.
  } catch (error) {
    // This handles failures from the database or password work above.
    console.error("There was an error logging in", error);
    // Log the failure on the server so it can be diagnosed.
    res.status(500).json({
      // Tell the caller the server could not complete the request.
      success: false,
      // Tell the frontend this request failed.
      message: "There was an error logging in.",
      // Explain that the server could not finish the login request.
      data: [],
      // This is the next value in the object or list being built.
    });
    // This closes the current block, call, or object.
  }
  // This closes the current block, call, or object.
});
// This closes the current block, call, or object.

router.put("/followSomeone/:myId/:theirId", async (req, res) => {
  // PUT /followSomeone updates both accounts' follower and following lists.
  const { myId, theirId } = req.params;
  // Read both account IDs from the URL.
  const updatedLists = req.body;
  // Read the updated follow information sent by the frontend.
  // console.log("this is the request params", req.params);

  try {
    // This starts work that can fail, such as a database or bcrypt operation.
    const newMe = await User.findByIdAndUpdate(
      // Update the current account's follow list in MongoDB.
      myId,
      // Use the current account ID for this database update.
      {
        // This opens the object or code block whose contents follow.
        following: updatedLists.myUpdatedList,
        // Save the current account's updated list of followed users.
      },
      // This is the next value in the object or list being built.
      { returnDocument: "after" },
      // Ask MongoDB for the updated account, not the old version.
    );
    // This closes the current block, call, or object.
    const newThem = await User.findByIdAndUpdate(
      // Update the other account's follower list in MongoDB.
      theirId,
      // Use the other account's ID for this database update.
      {
        // This opens the object or code block whose contents follow.
        followers: updatedLists.theirUpdatedFollowers,
        // Save the other account's updated list of followers.
      },
      // This is the next value in the object or list being built.
      { returnDocument: "after" },
      // Ask MongoDB for the updated account, not the old version.
    );
    // This closes the current block, call, or object.
    await newMe.save();
    // Persist the updated current account.
    await newThem.save();
    // Persist the updated other account.
    res.json({
      // Send the route result as JSON so the frontend can read it.
      success: true,
      // Tell the frontend this request succeeded.
      newMe: withoutPassword(newMe),
      // Return the updated current account without its password.
      newThem: withoutPassword(newThem),
      // Return the updated other account without its password.
    });
    // This closes the current block, call, or object.
  } catch (error) {
    // This handles failures from the database or password work above.
    console.error("There was an error following", error);
    // Log the failure on the server so it can be diagnosed.
    res.status(500).json({
      // Tell the caller the server could not complete the request.
      success: false,
      // Tell the frontend this request failed.
      message: "There was an error following.",
      // Explain that the follow update did not finish.
    });
    // This closes the current block, call, or object.
  }
  // This closes the current block, call, or object.
});
// This closes the current block, call, or object.
router.put("/unFollowSomeone/:myId/:theirId", async (req, res) => {
  // PUT /unFollowSomeone updates both accounts after someone unfollows.
  const { myId, theirId } = req.params;
  // Read both account IDs from the URL.
  const updatedLists = req.body;
  // Read the updated follow information sent by the frontend.
  try {
    // This starts work that can fail, such as a database or bcrypt operation.
    const newMe = await User.findByIdAndUpdate(
      // Update the current account's follow list in MongoDB.
      myId,
      // Use the current account ID for this database update.
      {
        // This opens the object or code block whose contents follow.
        following: updatedLists.myUpdatedList,
        // Save the current account's updated list of followed users.
      },
      // This is the next value in the object or list being built.
      { returnDocument: "after" },
      // Ask MongoDB for the updated account, not the old version.
    );
    // This closes the current block, call, or object.
    const newThem = await User.findByIdAndUpdate(
      // Update the other account's follower list in MongoDB.
      theirId,
      // Use the other account's ID for this database update.
      {
        // This opens the object or code block whose contents follow.
        followers: updatedLists.theirUpdatedFollowers,
        // Save the other account's updated list of followers.
      },
      // This is the next value in the object or list being built.
      { returnDocument: "after" },
      // Ask MongoDB for the updated account, not the old version.
    );
    // This closes the current block, call, or object.
    await newMe.save();
    // Persist the updated current account.
    await newThem.save();
    // Persist the updated other account.
    console.log(updatedLists);
    // Print this development information to the server console.
    res.status(202).json({
      // Return success with HTTP 202 to confirm the unfollow update was accepted.
      success: true,
      // Tell the frontend this request succeeded.
      message: "successfully unfollowed",
      // Confirm that the unfollow update succeeded.
      newMe: withoutPassword(newMe),
      // Return the updated current account without its password.
      newthem: withoutPassword(newThem),
      // Return the updated other account without its password.
    });
    // This closes the current block, call, or object.
  } catch (error) {
    // This handles failures from the database or password work above.
    console.error("There was an error unfollowing", error);
    // Log the failure on the server so it can be diagnosed.
    res.status(500).json({
      // Tell the caller the server could not complete the request.
      success: false,
      // Tell the frontend this request failed.
      message: "There was an error unfollowing.",
      // Explain that the unfollow update did not finish.
    });
    // This closes the current block, call, or object.
  }
  // This closes the current block, call, or object.
});
// This closes the current block, call, or object.
router.get("/getMyFollowersOrWhoFollowsMe/:theirIds", async (req, res) => {
  // GET /getMyFollowersOrWhoFollowsMe finds the accounts named in the URL.
  let { theirIds } = req.params;
  // Read the follower or following IDs from the URL.
  console.log("the followers or followings ids", theirIds);
  // Print this development information to the server console.
  try {
    // This starts work that can fail, such as a database or bcrypt operation.
    const allUsers = await User.find({}, "username email ObjectId");
    // Fetch only usernames, emails, and IDs because those are all this route needs.
    console.log("all users", allUsers);
    // Print this development information to the server console.

    const them = allUsers.filter((user) => {
      // Keep the accounts whose IDs appear in the requested follower list.
      if (theirIds.includes(user._id)) {
        // Check whether this account's ID is in the requested list.
        return user;
        // Return this value to the code that called this function.
      }
      // This closes the current block, call, or object.
    });
    // This closes the current block, call, or object.
    console.log("these are your followers", them);
    // Print this development information to the server console.

    res.json({
      // Send the route result as JSON so the frontend can read it.
      result: them,
      // Return the users whose IDs matched the requested list.
      success: true,
      // Tell the frontend this request succeeded.
      message: "here are your followers",
      // Tell the frontend these accounts match the requested IDs.
    });
    // This closes the current block, call, or object.
  } catch (error) {
    // This handles failures from the database or password work above.
    console.error("there was an error getting your followers");
    // Log the failure on the server so it can be diagnosed.
    res.status(504).json({ error: error.message });
    // Send the lookup error back with a gateway-timeout status.
  }
  // This closes the current block, call, or object.
});
// This closes the current block, call, or object.
export default router;
// Share this router so the main server can attach these endpoints.
// Code explanation 1: Exports the router object.
// Code explanation 2: Allows importing into the main server file.
// Code explanation 3: ES module default export syntax.

// Simple explanation 1: This shares the routes.
// Simple explanation 2: The main server will use them.
// Simple explanation 3: It connects everything together.
