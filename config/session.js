import session from "express-session";
import MongoStore from "connect-mongo";

const sessionConfig = session({
    name:"stylo.sid",
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,

    store:MongoStore.create({
        mongoUrl:"mongodb+srv://nnaju044_db_user:nnaju044@stylofasiondb.vwuxfuv.mongodb.net/stylo_fashion?retryWrites=true&w=majority",
        collectionName:"session"
    }),

    cookie: {
        httpOnly:true,
        secure:false,
        maxAge: 1000 * 60 * 60 * 24
    }

});

export default sessionConfig;