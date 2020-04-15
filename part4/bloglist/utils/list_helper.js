const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length == 0
   ? 0
   : blogs.reduce((sum, val) => sum + val.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const favBlog = blogs.sort((a, b) => a.likes < b.likes ? 1 : -1)[0]
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes
  }  
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
