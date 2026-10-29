import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "node:url";
// this will handle requests from react ^, we are loading the webserver framework, this is what runs our backend

import connectDB from "./config/db.js";
// ^ imports the database connection function, the server will call it on startup, this connects mongoDB to the backend

import postRoutes from "./routes/postRoutes.js";

import userRoutes from "./routes/userRoutes.js";

// ^ importing our router module which contains API endpoints, in other words we are loaing our API routes, these routes will respond to use requests- react calls those end points
import cors from "cors";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();
// officially creats an express application^ this is an object, it manages HTTP middleware, this object IS the webserver
// ^ all backend logic runs through this
  app.get("/health", (req, res) => res.send("ok"));
app.use(cors());
// app.use(cors()); is Express middleware that enables CORS (Cross‑Origin Resource Sharing).

//^^ In simple terms: it allows your backend API to accept requests from a different domain or port.
// app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
// import signUpRoutes from "./routes/signUpRoutes.js";
app.use("/", userRoutes);

app.use("/posts", postRoutes);

// app.get("/api/:whatever", (req, res) => {
//   const whatYouSaid = req.params.whatever;
//   res.send({ youSaid: whatYouSaid });
// });

// any requests to "/api/users" go to the router and the router handles the endpoint logic

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  } catch (error) {
    console.error(
      "Could not start the server because MongoDB connection failed.",
      error,
    );
    process.exit(1);
  }
};

startServer();

/**Code explanation 1: Starts the HTTP server.
 Code explanation 2: Binds the server to port 5000.
Code explanation 3: Node begins listening for incoming connections.

Simple explanation 1: The server starts running.
Simple explanation 2: It waits for requests from React.
Simple explanation 3: Port 5000 is the backend address. */
console.log("this is the end of sever.js ");
