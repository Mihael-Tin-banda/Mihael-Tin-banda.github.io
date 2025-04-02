/**
 * Safely parses a JWT token
 * @param {string} token - The JWT token to parse
 * @returns {object|null} The decoded token payload or null if invalid
 */
export function parseJwt(token) {
    try {
      if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
        return null;
      }
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }
  
  /**
   * Gets the authenticated user from localStorage 
   * @returns {object|null} User data or null if not authenticated
   */
  export function getAuthUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const userDataString = localStorage.getItem('user');
      let userData = null;
      
      if (userDataString && userDataString !== 'undefined' && userDataString !== 'null') {
        userData = JSON.parse(userDataString);
      }
      
      return userData;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }
  
  /**
   * Checks if user is authenticated
   * @returns {boolean} True if authenticated
   */
  export function isAuthenticated() {
    return !!localStorage.getItem('token');
  }
  
  /**
   * Logs out the current user
   */
  export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }