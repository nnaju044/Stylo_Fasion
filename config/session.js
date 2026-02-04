import dotenv from "dotenv";
dotenv.config();

import session from "express-session";
import MongoStore from "connect-mongo";

const SESSION_SECRET = process.env.SESSION_SECRET || "";

if (!SESSION_SECRET) {
    console.warn(
        "Warning: SESSION_SECRET is not set. Using an insecure fallback secret for development.\nSet SESSION_SECRET in your environment for production."
    );
}

const sessionConfig = session({
    name: "stylo.sid",
    secret: SESSION_SECRET || "dev_fallback_secret_change_me",
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "session",
    }),

    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    },
});

export default sessionConfig;