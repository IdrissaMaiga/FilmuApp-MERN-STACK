import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter,Navigate } from "react-router-dom";
import { ChakraProvider} from "@chakra-ui/react";
import App from "./App.jsx";
import "./index.css";
import theme from "../theme.js";
import Home from "./pages/Home.jsx";
import Movies from "./pages/movies/Movies.jsx";
import Shows from "./pages/shows/Shows.jsx";
import SearchMoviesAndSeries from "./pages/search/Search.jsx";

import { AuthProvider } from "./context/authProvider.jsx";
import Login from "./components/Login.jsx";
import PasswordChange from "./components/PaswordChange.jsx";
import Registration from "./components/Registration.jsx";
import GetAgents from "./components/Agents.jsx";
import Terms from "./components/terms.jsx";
import EmailVerification from "./components/createAccount.jsx";
import Admin from "./components/Admin/Admin.jsx";
import Deposit from "./components/transactions/deposite.jsx";
import TransactionPanel from "./components/transactions/usertransaction.jsx";
import CreateMoneyFlow from "./components/transactions/agenttransaction.jsx";
import UserProfile from "./components/user.jsx";
import SubscriptionTransaction from "./components/transactions/subcription.jsx";
import ChannelListPage from "./pages/ChannelFilterPage.jsx";
import ChannelDetailPage from "./pages/Channel.jsx";
import Movie from "./pages/movies/movie.jsx";
import Show from "./pages/shows/Show.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/movies",
        element: <Movies />,
      },
      {
        path: "/shows",
        element: <Shows />,
      },
      {
        path: "/search",
        element: <SearchMoviesAndSeries />,
      },       
      { path: "/movie/:id/:tmdb", element: <Movie></Movie> },
      { path: "/series/:id/:tmdb", element: <Show></Show> },
    
      {
        path: "/channel",
        element: <ChannelListPage/>,
      },
      {
        path: "/channel/:id",
        element: <ChannelDetailPage/>,
      },
      {
        path: "/deposit",
        element:<Deposit/> ,
      },
      {
        path: "/admin",
        element:<Admin/> ,
      },
      {
        path: "/profile",
        element:<UserProfile/> ,
      },
      {
        path: "/transaction",
        element:<TransactionPanel/>,
      },
      {
        path: "/subscribe",
        element:<SubscriptionTransaction/>,
      },
      {
        path: "/admin/transaction",
        element:<CreateMoneyFlow/> ,
      },
      {
        path:"*",
        element:(<Navigate to="/"/>)
      }
    ],

  },
  {
    path:"/login",
    element:(<Login/>)
  }
  , {
    path:"/changepassword",
    element:(<PasswordChange></PasswordChange>)
  }
  , {
    path:"/register",
    element:(<Registration></Registration>),
  }
  ,{
    path:"register/agent-registration",
    element:(<GetAgents></GetAgents>),
  },
  {
    path:"register/fast-registration",
    element:(<EmailVerification></EmailVerification>),
  }
  , {
    path:"terms",
    element:(<Terms></Terms>),
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
