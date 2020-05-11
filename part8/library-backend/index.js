const { ApolloServer, gql, UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const pubsub = new PubSub()

const BOOK_ADDED = 'BOOK_ADDED'

const MONGO_DB_URL = "mongodb+srv://fullstack:fullstack@cluster0-jrrmj.mongodb.net/library-graphql?retryWrites=true&w=majority"
mongoose.set('useCreateIndex', true)
const SECRET_KEY = "7358gjzXbbbnNf7B"

console.log('Connecting to MongoDB')
mongoose.connect(MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Recommendation {
    books: [Book!]!
    genre: String!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(genre: String): [Book!]!
    allAuthors: [Author!]!

    me: User

    recommendation: Recommendation
  }

  type Mutation {
    addBook(title: String!, 
      author: String!,
      published: Int!,
      genres: [String!]!): Book!

    editAuthor(name: String!, 
      setBornTo: Int!): Author

    createUser(
      username: String!,
      favoriteGenre: String!,
      password: String!
    ): User
    
    login(
      username: String!,
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
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
      const genre = args.genre
      let filter = {}

      if (genre) {
        filter = { genres: { $elemMatch: { $eq: genre } } }
      }

      return await Book.find(filter).populate('author')
    },
    allAuthors: () => {
      return Author.find({})
    },

    recommendation: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('Must be logged in for recommendations', {
          invalidArgs: args
        })
      }
      const genre = currentUser.favoriteGenre
      const books = await Book.find({ genres: { $elemMatch: { $eq: genre }}}).populate('author')
      return { books, genre }
    },

    me: (root, args, { currentUser}) => currentUser
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('Log in to create new book')
      }

      const authorName = args.author
      let author = await Author.findOne({ name: authorName })

      try {
        if (!author) {
          author = new Author({ name: authorName })
          await author.save()
        }
        const book = new Book({
          title: args.title,
          genres: args.genres,
          published: args.published
        })
        book.author = author

        await book.save()
        book.populate('author')
        pubsub.publish(BOOK_ADDED, { bookAdded: book })
        return book
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('Login to edit author detail')
      }
      
      const name = args.name
      const born = args.setBornTo

      const author = await Author.findOne({ name: name })

      if (!author) {
        return null
      }

      author.born = born
      await author.save()
      return author
    },

    createUser: async (root, args) => {
      const username = args.username
      const password = args.password
      const favoriteGenre = args.favoriteGenre
      
      const passwordHash = await bcrypt.hash(password, 10)
      const user = User({ username, favoriteGenre, passwordHash })
      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return user
    },

    login: async (root, args) => {
      const username = args.username
      const password = args.password

      const user = await User.findOne({ username })
      if (!user) {
        throw new AuthenticationError("Invalid username or password")
      }
      
      const match = await bcrypt.compare(password, user.passwordHash)

      if (!match) {
        throw new AuthenticationError("Invalid username or password")
      }
      
      const userForSigning = {
        username,
        id: user._id
      }
      
      const value = jwt.sign(userForSigning, SECRET_KEY)
      return { value }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authorization = req ? req.headers.authorization : null
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(authorization.substr(7),SECRET_KEY)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})

