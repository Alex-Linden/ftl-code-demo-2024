const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

// In-memory user store for simplicity
const users = {};

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Check if the user exists in the in-memory store
      if (!users[profile.id]) {
        // If not, create a new user
        users[profile.id] = {
          id: profile.id,
          username: profile.username,
          email: profile.emails ? profile.emails[0].value : null,
        };
      }
      // Pass the user to the next middleware
      return done(null, users[profile.id]);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users[id];
  done(null, user);
});
