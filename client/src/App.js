import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import { ThemeProvider } from './utils/themeContext';
import Footer from './components/Footer';
import Product from './pages/Product';
import Chat from './pages/Chat';
import Profile from "./pages/Profile";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <ThemeProvider>
          <>
            <Navbar />
            <Routes>
              <Route
                path='/'
                element={<Home />}
              />
              <Route
                path='/search/:query'
                element={<Search />}
              />
              <Route
                path='/search'
                element={<Search />}
              />
              <Route
                path="/product/:id"
                element={<Product />} />
              <Route
                path="/chat"
                element={<Chat />} />
              <Route 
                path="/profile" 
                element={<Profile />} />
            </Routes>
            <Footer />
          </>
        </ThemeProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;
