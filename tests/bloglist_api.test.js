const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const helper = require("../tests/test_helper")

describe("where there are blogs initially saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogList.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
  test("should return blogs in json format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })
  test("should return the correct amount of blogs in datsbase", async () => {
    const response = await api.get("/api/blogs")
    expect(response.body.length).toBe(helper.initialBlogList.length)
  })
  test("should verify the existence of a unique id property of the blogs", async () => {
    const response = await api.get("/api/blogs")
    for (let blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  })
  test("should return status code of 404 for a blog that does not exist", async () => {
    const iDNotExisting = await helper.nonExistingID()
    console.log(iDNotExisting)
    await api.get(`/api/blogs/${iDNotExisting}`).expect(404)
  })
  describe("addition of a new resource", () => {
    test("succeeds with valid data", async () => {
      const newResource = {
        title: "To verify new item creation",
        author: "test3",
        url: "test3",
        likes: 4
      }
      await api
        .post("/api/blogs")
        .send(newResource)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      const blogsInDb = await helper.blogsInDb()
      expect(blogsInDb.length).toBe(helper.initialBlogList.length + 1)
    })
    test("should default likes to zero in a post without the likes property", async () => {
      const postWithoutLikes = {
        title: "test blog without likes",
        author: "Joshua",
        url: "myurl.com"
      }
      await api
        .post("/api/blogs")
        .send(postWithoutLikes)
        .expect(200)
        .expect("Content-Type", /application\/json/)
      const blogsInDb = await helper.blogsInDb()
      for (let blog of blogsInDb) {
        if (!blog.hasOwnProperty("likes")) {
          blog.likes = 0
        }
      }
      expect(blogsInDb[3].likes).toBe(0)
    })

    test("should reject the creation of an invalid request with a 400 status code", async () => {
      const invalidRequest = {
        author: "John",
        likes: 2
      }
      await api
        .post("/api/blogs")
        .send(invalidRequest)
        .expect(400)
      const blogsInDb = await helper.blogsInDb()
      expect(blogsInDb.length).toBe(helper.initialBlogList.length)
    })
  })
  describe("blog operations", () => {
    test("should succeed in deleting an existing blog", async () => {
      const blogsInDb = await helper.blogsInDb()
      const blogToDelete = blogsInDb[1]
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const remainingBlogs = await helper.blogsInDb()
      console.log(remainingBlogs)
      expect(remainingBlogs.length).toBe(helper.initialBlogList.length - 1)
      const titles = remainingBlogs.map(blog => blog.title)
      expect(titles).not.toContain(blogToDelete.title)
    })
    test("should succeed in updating an existing blog", async () => {
      const blogsInDb = await helper.blogsInDb()
      const blogToUpdate = blogsInDb[2]
      const updatedBlog = {
        title: "React Native",
        author: "Dan Abramov & Bryan",
        url: "http://reactnative.com",
        likes: 13
      }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
      const availableBlogs = await helper.blogsInDb()
      console.log(availableBlogs)
      expect(availableBlogs.length).toBe(helper.initialBlogList.length)
    })
  })
})
afterAll(() => mongoose.connection.close())
