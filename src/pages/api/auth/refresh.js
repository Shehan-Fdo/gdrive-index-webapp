// src/pages/api/auth/refresh.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    // Note: In a production app, the refresh token would be stored in your database
    // and associated with the user's session, not in cookies
    const { refresh_token } = req.cookies;
    
    if (!refresh_token) {
      return res.status(401).json({ error: 'No refresh token available' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: refresh_token
    });

    // Request new tokens
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    if (!credentials || !credentials.access_token) {
      throw new Error('Failed to refresh access token');
    }

    // Set new access token cookie
    res.setHeader('Set-Cookie', [
      `access_token=${credentials.access_token}; Path=/; Max-Age=${credentials.expiry_date ? (credentials.expiry_date - Date.now()) / 1000 : 3600}; SameSite=Lax`
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    // Clear the cookies as they are no longer valid
    res.setHeader('Set-Cookie', [
      'access_token=; Path=/; Max-Age=0; SameSite=Lax',
      'refresh_token=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly'
    ]);
    
    res.status(401).json({ error: 'Failed to refresh token' });
  }
}