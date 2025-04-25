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
        // Check if user already exists in our db
        const existingUser = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile._json.email }],
        });

        console.log("Existing user:", existingUser);

        if (existingUser) {
          if (existingUser.name !== profile._json.displayName)
            existingUser.name = profile._json.displayName;
          if (existingUser.imgUrl !== profile._json.picture)
            existingUser.imgUrl = profile._json.picture;
          await existingUser.save({ validateBeforeSave: false });
          return done(null, existingUser);
        }

        // If not, create a new user in our db
        const newUser = await new User({
          googleId: profile.id,
          name: profile.displayName,
          imgUrl: profile._json.picture,
          email: profile._json.email,
          password: "doesnot matter",
        }).save();
        done(null, newUser);
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);
