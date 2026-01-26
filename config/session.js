import session from "express-session";
import MongoStore from "connect-mongo";

const sessionConfig = session({
    name:"stylo.sid",
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,

    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URI,
        collectionName:"session"
    }),
    
    cookie: {
        httpOnly:true,
        secure:false,
        maxAge: 1000 * 60 * 60 * 24
    }

});

export default sessionConfig;