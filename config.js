//change file name to "config.js"
const token = process.env.token;
const admin = process.env.admin;
const staticMapApiKey = process.env.staticMapApiKey
module.exports = {
  botToken: token,
  adminChatId: admin,       //your telegram chat id here, allows usage of /broadcast command
  staticMapApiKey: staticMapApiKey
}
