const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET || "shh"

const tokenMaker = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: "1d",
  }
  return jwt.sign(payload, SECRET, options)
}

module.exports = {
  tokenMaker,
}
