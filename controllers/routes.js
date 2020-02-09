const blogRouter = require("express").Router()
const Blog = require("../models/blog")

blogRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

blogRouter.post("/", async (request, response, next) => {
  const body = request.body
  const blogToPost = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  try {
    const savedBlog = await blogToPost.save()
    response.json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})
blogRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
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
