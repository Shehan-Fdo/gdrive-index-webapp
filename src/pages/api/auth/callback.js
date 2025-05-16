// src/pages/api/auth/callback.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    // Get authorization code from query parameters
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code missing' });
    }

    // Create OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens || !tokens.access_token) {
      throw new Error('Failed to retrieve access token');
    }

    // Set secure HttpOnly cookie with the access token
    // In production, add: secure: true, httpOnly: true
    const cookieOptions = {
      maxAge: tokens.expiry_date ? (tokens.expiry_date - Date.now()) : 3600000, // 1 hour default
      path: '/',
      sameSite: 'lax',
      // secure: process.env.NODE_ENV === 'production', // Uncomment in production
      // httpOnly: true, // Uncomment in production
    };

    // Set cookies
    res.setHeader('Set-Cookie', [
      `access_token=${tokens.access_token}; Path=${cookieOptions.path}; Max-Age=${cookieOptions.maxAge}; SameSite=${cookieOptions.sameSite}`,
    ]);

    // If you have a refresh token, store it securely (not in a client-accessible cookie)
    // In a real app, store refresh tokens in your database associated with the user's session
    if (tokens.refresh_token) {
      // This is just for demo purposes - in production store in a database
      // console.log('Refresh token received:', tokens.refresh_token);
    }

    // Fetch user information
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });

    try {
      const userInfo = await oauth2.userinfo.get();
      console.log(`User authenticated: ${userInfo.data.email}`);
    } catch (userInfoError) {
      console.error('Error fetching user info:', userInfoError);
    }

    // Redirect to the home page
    res.redirect('/');
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}