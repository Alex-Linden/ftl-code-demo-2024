const express = require('express');
const session = require('express-session');

const axios = require('axios');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors')
const qs = require('qs');

const app = express();
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // Allow sending cookies with requests
  cookie: {
    maxAge: 60 * 1000 // Session cookie expires in 1 min
  }
}));

app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET_KEY, 
  resave: false,
  saveUninitialized: true
})); 

// GitHub OAuth configuration
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;


app.get('/auth/github', (req, res) => {
  const params = {
    client_id: CLIENT_ID,
    redirect_uri: 'http://localhost:3000/auth/github/callback',
    scope: 'user'
  };

  res.json({ redirectUrl: `https://github.com/login/oauth/authorize?${qs.stringify(params)}` });
});

app.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;
  console.log(`exchange this code: ${code}`);

  try {

    // Exchange code for access token
    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token', 
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: 'http://localhost:3000/auth/github/callback',
      }, 
      {      
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    // Store user information in session or database
    req.session.githubToken = data.access_token;
    console.log(`for a github access token: ${data.access_token}`);
    res.send("Successfully authenticated! You can close this window.")

  } catch (error) {
    
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

app.get('/auth/session', (req, res) => {
  const cookie = req.cookies['connect.sid'];
  console.log(cookie)
  
  if (req.session && req.session.githubToken) {
    res.json({ authenticated: true, accessToken: req.session.githubToken });
    console.log("Authenticated!")
  } else {
    res.json({ authenticated: false });
  }
});

app.get('/api/user', verifyToken, (req, res) => {
  res.json({ user: req.user.login });
});

// Middleware for verifying access tokens
async function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    const user = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': bearerHeader
      }
    });
    
    req.user = user.data;
    next();
  } else {
    // Forbidden if no token provided
    res.sendStatus(403);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
