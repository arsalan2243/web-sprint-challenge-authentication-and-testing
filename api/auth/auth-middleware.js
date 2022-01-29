const Us = require("../model/users-model")
const checkpayload = (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return next({ status: 401, message: `username and password required` })
    }
    req.body = { username: username.trim(), password: password.trim() }
    next()
  } catch (error) {
    next(error)
  }
}

const checkUsernameIsUnique = async (req, res, next) => {
  try {
    const username = req.body.username
    const userIsunique = await Us.findBy({ username: username })
    if (userIsunique === undefined) {
      next()
    } else if (userIsunique) {
      next({ status: 401, message: "username taken" })
    }
  } catch (error) {
    next(error)
  }
}

const checkUsernameExist = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const exist = await Us.findBy({ username: username })
    if (!username || !password) {
      return next({ message: `username and password required` })
    }
    if (exist === undefined) {
      return next({
        status: 401,
        message: "invalid credentials",
      })
    } else {
      req.user = exist
      next()
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkpayload,
  checkUsernameIsUnique,
  checkUsernameExist,
}
