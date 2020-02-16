const supertest = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const api = supertest(app)
const helper = require("../tests/test_helper")
const User = require("../models/users")

describe("when there is initially one user in database", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({
      username: "mary10",
      name: "mary",
      password: "heashyet"
    })
    await user.save()
  })
  test("should succesfully create a fresh user", async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "joe23",
      name: "joseph",
      password: "hiryuteuri"
    }
    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(user => user.username)
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
    expect(usernames).toContain(newUser.username)
  })
  describe("creating a new user", () => {
    test("should not succeed if the length of the password is less than 3", async () => {
      const usersAtStart = await helper.usersInDb()
      const passwordLessthan3 = {
        username: "paster",
        name: "patrick",
        password: "ku"
      }
      await api
        .post("/api/users")
        .send(passwordLessthan3)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
    test("should not succeed if the length of the username is less than 3", async () => {
      const usersAtStart = await helper.usersInDb()
      const usernameLessthan3 = {
        username: "pa",
        name: "patrick",
        password: "kujrut"
      }
      await api
        .post("/api/users")
        .send(usernameLessthan3)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
    test("should not succeed if username is already taken", async () => {
      const usersAtStart = await helper.usersInDb()
      const usernameTaken = {
        username: "mary10",
        name: "kingdom",
        password: "kujrut"
      }
      await api
        .post("/api/users")
        .send(usernameTaken)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
    test("should not succeed if username not supplied", async () => {
      const usersAtStart = await helper.usersInDb()
      const usernameNotGiven = {
        username: "",
        name: "kingdom",
        password: "kujrut"
      }
      await api
        .post("/api/users")
        .send(usernameNotGiven)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
    test("should not succeed if name is not supplied", async () => {
      const usersAtStart = await helper.usersInDb()
      const nameNotGiven = {
        username: "mary10",
        name: "",
        password: "kujrut"
      }
      await api
        .post("/api/users")
        .send(nameNotGiven)
        .expect(400)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
  })
})

afterAll(() => mongoose.connection.close())
