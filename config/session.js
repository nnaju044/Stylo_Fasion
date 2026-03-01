import dotenv from "dotenv";
dotenv.config();

import session from "express-session";
import MongoStore from "connect-mongo";

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  console.warn("SESSION_SECRET not set. Using dev fallback.");
}

const sessionConfig = session({
  name: "stylo.sid",

  secret: SESSION_SECRET || "dev_fallback_secret_change_me",

  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 60 * 60 * 24, 
  }),

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, 
  },
});

export default sessionConfig;