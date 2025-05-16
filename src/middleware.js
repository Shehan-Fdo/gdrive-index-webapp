// src/middleware.js
import { NextResponse } from 'next/server';

// This middleware checks for authentication on protected routes
export function middleware(request) {
  // Get the pathname from the request
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  // Add any paths you want to protect here
  const protectedPaths = ['/protected', '/dashboard'];
  const isPathProtected = protectedPaths.some(path => 
    pathname.startsWith(path)
  );

  // If not a protected path, allow the request to continue
  if (!isPathProtected) {
    return NextResponse.next();
  }

  // Check for access token in cookies
  const accessToken = request.cookies.get('access_token')?.value;

  // If no access token is found, redirect to the home page
  if (!accessToken) {
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure paths that should trigger this middleware
export const config = {
  matcher: [
    // Add paths you want this middleware to run on
    '/protected/:path*',
    '/dashboard/:path*',
  ],
};