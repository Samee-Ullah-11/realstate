// Vercel function entry — the real handler lives in server/vercel.js so that
// its requires resolve from server/node_modules.
module.exports = require('../server/vercel');
