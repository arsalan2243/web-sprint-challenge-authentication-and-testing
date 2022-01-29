const jwt = require("jsonwebtoken")

const SECRET = process.env.SECRET || "shh"

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return next({
      status: 401,
      message: "token required",
    })
  }
  jwt.verify(token, SECRET, (err) => {
    if (err) {
      return next({ status: 401, message: "invalid token" })
    }

    return next()
  })
  /*
    IMPLEMENT
    1- On valid token in the Authorization header, call next.
    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".
    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
}
