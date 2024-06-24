const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Author = require('./models/author');
const Book = require('./models/book');
const { GraphQLError } = require('graphql');
require('dotenv').config();

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

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String]!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
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
  }

  type Mutation {
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({});
      } else if (args.author && !args.genre) {
        const author = await Author.findOne({ name: args.author });
        return await Book.find({ author: author._id });
      }
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: (root) => {
      const counter = books.filter((book) => book.author === root.name);
      return counter.length;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author, born: null });
        await author.save();
      }
      const newBook = new Book({
        title: args.title,
        author,
        published: args.published,
        genres: args.genres,
      });

      await newBook.save();

      return newBook;
    },
    editAuthor: (root, args) => {
      const author = authors.find((author) => author.name === args.name);
      if (!author) {
        return null;
      }

      const updatedAuthor = { ...author, born: args.setBornTo };
      authors = authors.map((author) =>
        author.name === args.name ? updatedAuthor : author
      );
      return updatedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
