const Blog = require("../models/blog")
const User = require("../models/users")
const initialBlogList = [
  {
    title: "Golang",
    author: "Google",
    url: "https://golang.com",
    likes: 3
  },
  {
    title: "Gatsby",
    author: "Kyle Matthews",
    url: "https://www.gatsbyjs.com",
    likes: 90
  },
  {
    title: "React Native",
    author: "Joe Jack",
    url: "http://reactnative",
    likes: 8
  }
]
const nonExistingID = async () => {
  const nonExistingBlog = new Blog({
    title: "I dont exist",
    author: "JackMa",
    url: "testchfyt.com"
  })
  await nonExistingBlog.save()
  await nonExistingBlog.remove()
  return nonExistingBlog._id.toString()
}
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}
module.exports = {
  initialBlogList,
  blogsInDb,
  nonExistingID,
  usersInDb
}
