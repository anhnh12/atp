/**
 * Subdomain Detection Utility
 * 
 * Detects if the current hostname is an admin subdomain
 * Works for both development (localhost) and production (admin.domain.com)
 */

/**
 * Checks if current hostname is an admin subdomain
 * @returns true if on admin subdomain, false otherwise
 */
export const isAdminSubdomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // Development: Check for localhost with admin port or admin subdomain
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // For localhost, check if we're on a specific port or path
    // You can customize this for local development
    // For now, we'll use path-based routing on localhost
    return false; // Use path-based routing on localhost
  }
  
  // Production: Check if subdomain is 'admin'
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    // admin.domain.com format
    return parts[0] === 'admin';
  }
  
  return false;
};

/**
 * Gets the base path for routing
 * Returns empty string for subdomain routing, or path for localhost
 */
export const getBasePath = (): string => {
  if (isAdminSubdomain()) {
    return ''; // No base path needed for subdomain routing
  }
  
  // For localhost or main domain, use path-based routing
  // Check if we need basename for GitHub Pages
  if (process.env.PUBLIC_URL && process.env.PUBLIC_URL !== '.') {
    try {
      const url = new URL(process.env.PUBLIC_URL);
      return url.pathname || '';
    } catch {
      return '';
    }
  }
  
  return '';
};
