import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile", profile);
        // Check if user already exists in our db
        // const existingUser = await User.findOne({ googleId: profile.id });
        // if (existingUser) {
        //   return done(null, existingUser);
        // }

        // // If not, create a new user in our db
        // const newUser = await new User({
        //   googleId: profile.id,
        //   username: profile.displayName,
        //   imgUrl: profile._json.picture,
        // }).save();
        // done(null, newUser);
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);
