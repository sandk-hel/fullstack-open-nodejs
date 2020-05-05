const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const uuid = require('uuid')
const Book = require('./models/book')
const Author = require('./models/author')

const MONGO_DB_URL = "mongodb+srv://fullstack:fullstack@cluster0-jrrmj.mongodb.net/library-graphql?retryWrites=true&w=majority"
let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

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
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => { 
      let authorFilter = book => true
      let genreFilter = book => true

      if (args.author) {
        authorFilter = book => book.author === args.author
      }

      if (args.genre) {
        genreFilter = book => book.genres.includes(args.genre)
      } 

      const combinedFilter = book => authorFilter(book) && genreFilter(book)
      return books.filter(combinedFilter)
    },
    allAuthors: () => {
      return authors.map(author => {
        const authorBooks = books.filter(b => b.author === author.name)
        return { ...author, bookCount: authorBooks.length }
      })
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

    editAuthor: (root, args) => {
      const name = args.name
      const born = args.setBornTo
      
      const author = authors.find(author => author.name === name)
      
      if (!author) {
        return null
      }

      const authorBooks = books.filter(b => b.author === author.name)

      const updatedAuthor = { ...author, born, bookCount: authorBooks.length }

      authors = authors.map(author => author.name === name 
        ? updatedAuthor 
        : author
      )
      return updatedAuthor
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

