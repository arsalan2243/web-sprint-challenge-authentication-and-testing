const router = require("express").Router()
const bcrypt = require("bcryptjs")
const { tokenMaker } = require("../token-maker")
const { insert } = require("../model/users-model")
const {
  checkpayload,
  checkUsernameIsUnique,
  checkUsernameExist,
} = require("./auth-middleware")

router.post(
  "/register",
  checkpayload,
  checkUsernameIsUnique,
  async (req, res, next) => {
    try {
      const hash = bcrypt.hashSync(req.body.password, 4)
      req.body.password = hash
      const newuser = await insert(req.body)
      res.status(200).json(newuser)
    } catch (error) {
      next(error)
    }

    /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!
    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }
    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }
    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  }
)

router.post("/login", checkpayload, checkUsernameExist, (req, res, next) => {
  try {
    const userExist = req.user
    if (
      userExist &&
      bcrypt.compareSync(req.body.password, userExist.password)
    ) {
      const token = tokenMaker(req.user)
      res.status(200).json({
        message: `welcome, ${req.user.username}`,
        token: token,
      })
    } else {
      next({ status: 401, message: "invalid credentials" })
    }
  } catch (error) {
    next(error)
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }
    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }
    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
})

module.exports = router
