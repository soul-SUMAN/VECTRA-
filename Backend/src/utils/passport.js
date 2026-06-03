import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.models.js";

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email    = profile.emails[0].value;
        const fullname = profile.displayName;
        const avatar   = profile.photos[0]?.value;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
          // Auto-register with Google data
          // Username: first part of email + random 4 digits
          const username = email.split("@")[0] + Math.floor(1000 + Math.random() * 9000);
          user = await User.create({
            email,
            fullname,
            avatar,
            username,
            password: Math.random().toString(36), // random password — Google users log in via OAuth only
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Minimal serialize/deserialize — only used for the OAuth redirect flow
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;