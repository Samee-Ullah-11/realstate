const Agent = require('../models/Agent');
const ApiError = require('../utils/ApiError');

// Single-agent MVP: the public site shows the one active agent.
async function getActive() {
  const agent = await Agent.findOne({ isActive: true }).select('-userId').lean();
  if (!agent) throw ApiError.notFound('No agent configured');
  return agent;
}

module.exports = { getActive };
