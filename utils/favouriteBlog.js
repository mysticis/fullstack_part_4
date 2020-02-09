const favouriteBlog = ([blog]) => {
  if (blog.length > 1) {
    const max = blog.map(blogs => blogs.likes)
    const top = Math.max(...max)
    const result = blog.filter(blog => blog.likes === top)
    return {
      title: result[0].title,
      author: result[0].author,
      likes: result[0].likes
    }
  }
}
const blogWithOneItem = ([blog]) => {
  if (blog.length === 1) {
    return {
      title: blog[0].title,
      author: blog[0].author,
      likes: blog[0].likes
    }
  }
}
module.exports = { favouriteBlog, blogWithOneItem }
