const mostBlogs = ([blogs]) => {
  let counts = {}
  let result = {}
  blogs
    .map(blog => blog.author)
    .forEach(author => {
      counts[author] = (counts[author] || 0) + 1
    })
  const top = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  )
  const max = Math.max.apply(
    null,
    Object.keys(counts).map(key => counts[key])
  )
  result = {
    author: top,
    blogs: max
  }
  return result
}
module.exports = mostBlogs
