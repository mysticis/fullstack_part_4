const User = require("../models/users")
const bcrypt = require("bcrypt")
const userRouter = require("express").Router()
const helper = require("../tests/test_helper")
userRouter.get("/", async (request, response, next) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1
  })
  response.json(users.map(user => user.toJSON()))
})

userRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body

    if (body.password.length < 3) {
      response
        .status(400)
        .json({ error: "password must be minimum of 3 characters" })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const newUser = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })
    const users = await helper.usersInDb()
    const usernames = users.map(user => user.username)
    if (usernames.includes(newUser.username)) {
      return response.status(400).json({ error: "username already taken!" })
    }
    const savedUser = await newUser.save()
    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = userRouter
