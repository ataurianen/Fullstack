const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');
const { GraphQLError } = require('graphql');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const MONGODB_URI = process.env.MONGODB_URI;

console.log(`Connecting to ${MONGODB_URI}`);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const typeDefs = `

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
    me: User
  }

    type User {
    username: String!
    favoriteGenre: String!
  }
    type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

 
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    me: async (root, args, context) => {
      return context.currentUser;
    },
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        const allBooks = await Book.find({}).populate('author');
        return allBooks;
      } else if (args.author && !args.genre) {
        const author = await Author.findOne({ name: args.author });
        return await Book.find({ author: author._id });
      } else if (!args.author && args.genre) {
        return await Book.find({ genres: { $all: [args.genre] } });
      } else {
        const author = await Author.findOne({ name: args.author });
        return await Book.find({
          author: author._id,
          genres: { $all: [args.genre] },
        });
      }
    },
    allAuthors: async () => {
      const allBooks = await Book.find({}).populate('author');
      const allAuthors = await Author.find({});
      return allAuthors.map((author) => ({
        name: author.name,
        born: author.born,
        bookCount: allBooks.filter((book) => book.author.name === author.name)
          .length,
        id: author._id,
      }));
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author, born: null });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError('Adding author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error,
            },
          });
        }
      }
      const newBook = new Book({
        title: args.title,
        author,
        published: args.published,
        genres: args.genres,
      });
      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError('Adding book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }

      return newBook;
    },
    editAuthor: async (root, args) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;
      return author.save();
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      try {
        return user.save();
      } catch (error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
