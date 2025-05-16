// src/pages/api/auth/logout.js
export default function handler(req, res) {
  // Clear the access token cookie
  res.setHeader('Set-Cookie', [
    'access_token=; Path=/; Max-Age=0; SameSite=Lax'
  ]);
  
  // Redirect to home page
  res.redirect('/');
}