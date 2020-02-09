const totalLikes = ([blog]) => {
  const likes = blog.map(blog => blog.likes)
  const reducer = (acc, cur) => acc + cur
  return likes.reduce(reducer)
}
const likesWhenEmpty = ([blog]) => {
  if (blog.length === 0) return 0
}

const likesWithOneList = ([blog]) => {
  if (blog.length === 1) {
    return blog[0].likes
  }
}
module.exports = { totalLikes, likesWhenEmpty, likesWithOneList }
