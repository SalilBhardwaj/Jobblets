const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const createToken = (payload) => {
  try {
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    if (!payload) {
      throw new Error('Payload is required for token creation');
    }
    const token = jwt.sign(payload, jwtSecret);
    return token;
  } catch (error) {
    throw new Error(`Failed to create token: ${error.message}`);
  }
};

const verifyToken = (token) => {
  try {
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    if (!token) {
      throw new Error('Token is required for verification');
    }
    const payload = jwt.verify(token, jwtSecret);
    return payload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
};

const tokenUtils = { createToken, verifyToken };
module.exports = tokenUtils;