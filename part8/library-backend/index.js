const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

const MONGO_DB_URL = "mongodb+srv://fullstack:fullstack@cluster0-jrrmj.mongodb.net/library-graphql?retryWrites=true&w=majority"
mongoose.set('useCreateIndex', true)

console.log('Connecting to MongoDB')
mongoose.connect(MONGO_DB_URL, { useNewUrlParser: true, 
  useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB: ', error.message)
  })

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    published: Int! 
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(title: String!, 
      author: String!,
      published: Int!,
      genres: [String!]!): Book!

    editAuthor(name: String!, 
      setBornTo: Int!): Author
  }
`

const resolvers = {
  Author: {
    bookCount: async (root) => 
      Book.count({ author: { $in: root.id } })
  },
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => { 
      return await Book.find({}).populate('author')
    },
    allAuthors: () => {
      return Author.find({})
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      const authorName = args.author 
      let author = await Author.findOne({ name: authorName })
      
      if (!author) {
        author = new Author({ name: authorName })
        await author.save()
      }

      const newBook = {
        title: args.title,
        genres: args.genres,
        published: args.published
      }

      const book = new Book(newBook)
      book.author = author
      await book.save()
      return book.populate('author')
    },

    editAuthor: async (root, args) => {
      const name = args.name
      const born = args.setBornTo
      
      const author = await Author.findOne({ name: name })
      
      if (!author) {
        return null
      }
      
      author.born = born
      await author.save()
      return author
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

