// src/pages/api/drive/files.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    // Get access token from cookies
    const { access_token } = req.cookies;
    
    if (!access_token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Set up authentication with the access token
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    auth.setCredentials({ access_token });

    // Create Google Drive client
    const drive = google.drive({ version: 'v3', auth });

    // List files from Google Drive
    const response = await drive.files.list({
      pageSize: 50,
      fields: 'files(id, name, mimeType, webViewLink)',
      orderBy: 'modifiedTime desc',
      // Optional: Add query parameters to filter files
      // q: "mimeType != 'application/vnd.google-apps.folder'"
    });

    // Return the files list
    return res.status(200).json(response.data.files);
  } catch (error) {
    console.error('Google Drive API error:', error);
    
    // Handle token expiration or invalid token
    if (error.code === 401 || error.status === 401) {
      return res.status(401).json({ error: 'Authentication failed. Please login again.' });
    }
    
    // Handle other errors
    return res.status(500).json({ error: 'Failed to fetch files from Google Drive' });
  }
}