require("dotenv").config();
const { clientID, clientSecret } = process.env;
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");

passport.use(
  "oauth2",
  new OAuth2Strategy(
    {
      authorizationURL: "https://www.example.com/oauth2/authorize",
      tokenURL: "https://www.example.com/oauth2/token",
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "http://localhost:8000/auth/example/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
