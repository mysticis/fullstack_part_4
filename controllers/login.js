const jwt = require("jsonwebtoken")
const User = require("../models/users")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()

loginRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body

    const user = await User.findOne({ username: body.username })
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)
    if (!(user && passwordCorrect)) {
      return response
        .status(401)
        .json({ error: "invalid username or password" })
    }
    const userForToken = {
      username: user.username,
      id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)

    response
      .status(200)
      .send({ token, username: user.username, name: user.name })
  } catch (exception) {
    next(exception)
  }
})

module.exports = loginRouter
