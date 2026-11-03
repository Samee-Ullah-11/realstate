const authService = require('../services/auth.service');
const { COOKIE_NAME, cookieOptions } = require('../middleware/auth');

async function login(req, res) {
  const { user, token } = await authService.login(req.body.email, req.body.password);
  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

async function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
  res.json({ ok: true });
}

async function changePassword(req, res) {
  await authService.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  res.json({ ok: true });
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { login, logout, changePassword, me };
