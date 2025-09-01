// Debug script to check authentication state
// Run this in the browser console to debug the role issue

console.log('=== MSHANDO AUTHENTICATION DEBUG ===');

// Check localStorage for token and user data
const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');

console.log('Token:', token ? 'Present' : 'Not found');
console.log('Refresh Token:', refreshToken ? 'Present' : 'Not found');

// Decode JWT token to see the payload (if present)
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token Payload:', payload);
    console.log('Token Role:', payload.role || payload.authorities || 'No role found');
    console.log('Token Subject:', payload.sub);
    console.log('Token Expires:', new Date(payload.exp * 1000));
  } catch (error) {
    console.error('Error decoding token:', error);
  }
}

// Check Redux store state
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  console.log('Redux DevTools detected - check the store state for auth slice');
}

// Check current URL and expected redirect
console.log('Current URL:', window.location.href);
console.log('Expected for TASKER: /tasker');
console.log('Expected for CUSTOMER: /customer');

// Check if there are any API errors in network tab
console.log('Check Network tab for:');
console.log('1. POST /auth/login - response should contain user with correct role');
console.log('2. GET /users/me - response should contain correct user role');

console.log('=== DEBUG COMPLETE ===');
