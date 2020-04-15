const _ = require('lodash')

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

const mostBlogs = (blogs) => {
  return _.chain(blogs)
          .groupBy('author')
          .entries()
          .map(a => { 
            return { author: a[0],
                  blogs: a[1].length }
          }) 
          .maxBy('blogs')
          .value()
}

const mostLikes = (blogs) => {
  const sumReducer = (a, b) => a + b.likes
  return _.chain(blogs)
          .groupBy('author')
          .entries()
          .map(a => {
            return { author:a[0], 
                    likes: a[1].reduce(sumReducer, 0) }
          }) 
          .maxBy('likes')
          .value()
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
