require("dotenv").config(); // Load environment variables
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const verifyToken = require("./middleware/auth");
const cors = require('cors')

const app = express();
const port = 3000;
app.use(cors({
  origin: "http://localhost:5173",
}));

// Use environment variables for OAuth credentials
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUrl = "http://localhost:3000/auth/google/callback";

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

app.get("/protected_route", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.get("/auth/login", (req, res) => {
  console.log('login')
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });

  console.log('redir')
  res.redirect(authorizationUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log(tokens)

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const googleUser = await oauth2.userinfo.get();
    console.log(googleUser.data);
    // check against the DB

    res.redirect(`http://localhost:5173/callback?token=${tokens.id_token}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Authentication failed!");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});