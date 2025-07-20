import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * @param {string} id - The user's MongoDB document ID.
 * @returns {string} - The generated JWT.
 */
const generateToken = (id) => {
  
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' } 
  );
};

export default generateToken;