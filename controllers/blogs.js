const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/users")
const jwt = require("jsonwebtoken")

//get all blogs populated with their creators
blogRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
  } catch (exception) {
    next(exception)
  }
})
//create a blog with verified user
blogRouter.post("/", async (request, response, next) => {
  const token = request.token
  const body = request.body
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" })
    }
    const user = await User.findById(decodedToken.id)

    const blogToPost = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id,
      likes: body.likes
    })

    const savedBlog = await blogToPost.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})
//delete a blog by the user who created it
blogRouter.delete("/:id", async (request, response, next) => {
  const blogIdToDelete = request.params.id
  const token = request.token
  try {
    const userToDeleteBlog = await Blog.findById(blogIdToDelete)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!(token && decodedToken)) {
      return response.status(401).json({ error: "invalid token" })
    } else if (
      userToDeleteBlog.user.toString() !== decodedToken.id.toString()
    ) {
      return response.status(401).json({ error: "unauthorized user" })
    }
    await Blog.findByIdAndRemove(blogIdToDelete)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogRouter.put("/:id", (request, response, next) => {
  const body = request.body
  const blogToUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error => next(error))
})
module.exports = blogRouter

/*
blogRouter.put("/:id", async (request, response, next) => {
  const body = request.body
  const blogToUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blogToUpdate,
      {
        new: true
      }
    )
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})*/
