const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const path = require('path');
const db = require('./config/connection');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.get(/^(?!\/?graphql).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  const httpServer = http.Server(app);
  const io = socketIo(httpServer);

  io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('message', (message) => {
      // Handle the incoming message event
      console.log('Received message:', message);
      // Emit the message to other connected client
      socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });

  db.once('open', () => {
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
