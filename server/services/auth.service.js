const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');

const TOKEN_TTL = '7d';

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: TOKEN_TTL,
  });
}

async function login(email, password) {
  const user = await User.findOne({ email: email.toLowerCase() });
  // Same error for wrong email and wrong password
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw ApiError.unauthorized('Wrong email or password');
  }
  return { user, token: signToken(user) };
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.unauthorized();
  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw ApiError.badRequest('Current password is wrong');
  }
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
}

async function createUser({ email, password, name, role }) {
  return User.create({
    email,
    name,
    role,
    passwordHash: await bcrypt.hash(password, 10),
  });
}

module.exports = { login, changePassword, createUser, signToken };
