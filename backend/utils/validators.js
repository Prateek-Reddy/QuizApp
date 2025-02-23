// Validate email format
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 8; // At least 8 characters
  };
  
  // Validate role (admin or student)
  const validateRole = (role) => {
    return ['admin', 'student'].includes(role);
  };
  
  module.exports = { validateEmail, validatePassword, validateRole };