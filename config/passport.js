import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../Src/models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const googleImage = profile.photos?.[0]?.value;

        let user = await User.findOne({ email });

        if (user) {
          
          if (!user.googleId) {
            user.googleId = googleId;
            user.googleImage = googleImage;
            await user.save();
          }

          return done(null, user);
        }

      
        user = await User.create({
          email,
          googleId,
          googleImage,
          firstName: profile.name.givenName || "",
          lastName: profile.name.familyName || "",
          isEmailVerified: true,
        });

        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
