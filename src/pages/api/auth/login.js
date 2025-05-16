// src/pages/api/auth/login.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    // Ensure environment variables are set
    const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env;
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
      return res.status(500).json({
        error: 'Server configuration error: Missing Google credentials'
      });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    // Define required scopes
    const scopes = [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    // Generate authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Will return a refresh token
      prompt: 'consent',
      scope: scopes,
      // Optional: Add additional parameters
      // include_granted_scopes: true
    });

    // Redirect to Google auth page
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to initiate Google authentication' });
  }
}