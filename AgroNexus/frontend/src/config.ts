// Centralized configuration for the frontend API URL.
// Automatically appends '/api' if missing and handles trailing slashes.

let rawApiUrl = import.meta.env.VITE_API_URL || 'https://khetseva-backend-ki7y.onrender.com/api';

// Strip trailing slash if present
if (rawApiUrl.endsWith('/')) {
  rawApiUrl = rawApiUrl.slice(0, -1);
}

// Ensure the URL ends with /api
if (!rawApiUrl.endsWith('/api')) {
  rawApiUrl = `${rawApiUrl}/api`;
}

export const API_URL = rawApiUrl;
