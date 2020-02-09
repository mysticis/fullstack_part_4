const mostLikes = ([blogs]) => {
  let result = {}
  let maxCallback = (max, cur) => Math.max(max, cur)
  const maxLikes = blogs.map(item => item.likes).reduce(maxCallback, -Infinity)
  let val = blogs.filter(item => item.likes === maxLikes)
  result = {
    author: val[0].author,
    likes: val[0].likes
  }
  return result
}
module.exports = mostLikes
