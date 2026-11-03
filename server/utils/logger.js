const { env } = require('../config/env');

function line(level, msg, meta) {
  const time = new Date().toISOString();
  const extra = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${time} [${level}] ${msg}${extra}`;
}

module.exports = {
  info: (msg, meta) => {
    if (!env.isTest) console.log(line('info', msg, meta));
  },
  warn: (msg, meta) => {
    if (!env.isTest) console.warn(line('warn', msg, meta));
  },
  error: (msg, meta) => console.error(line('error', msg, meta)),
};
