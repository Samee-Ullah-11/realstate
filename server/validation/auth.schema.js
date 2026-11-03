const { z } = require('zod');

const login = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

const changePassword = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(8).max(128),
});

module.exports = { login, changePassword };
