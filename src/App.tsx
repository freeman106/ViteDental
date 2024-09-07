import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Profile from "./routes/profile";
import Home from "./routes/home";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";
import Quotes from "./routes/quotes";
import QuoteDetail from "./routes/quote-detail";
import MyReaquests from "./routes/my-requests";
import Request from "./routes/request";
import ReviewBoard from "./routes/review-board";
import WriteReview from "./routes/write-review";
import ReviewDetail from "./routes/review-detail";
import ClientHospital from "./routes/client-hospital";
import CreateAccountHospital from "./routes/create-account-hospital";
import HomeHospital from "./routes/home-hospital";
import ProfileHospital from "./routes/profile-hospital";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "quotation",
        element: (
          <ProtectedRoute>
            <Request />
          </ProtectedRoute>
        ),
      },
      {
        path: "quotes",
        element: (
          <ProtectedRoute>
            <Quotes />
          </ProtectedRoute>
        ),
      },
      {
        path: "quote/:id",
        element: (
          <ProtectedRoute>
            <QuoteDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-requests",
        element: (
          <ProtectedRoute>
            <MyReaquests />
          </ProtectedRoute>
        ),
      },
      {
        path: "write-review",
        element: (
          <ProtectedRoute>
            <WriteReview />
          </ProtectedRoute>
        ),
      },
      {
        path: "home-hospital",
        element: (
          <ProtectedRoute>
            <HomeHospital />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile-hospital",
        element: (
          <ProtectedRoute>
            <ProfileHospital />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "client-hospital",
    element: <ClientHospital />,
  },
  {
    path: "/create-account-hospital",
    element: <CreateAccountHospital />,
  },
  {
    path: "/review-board",
    element: <ReviewBoard />,
  },
  {
    path: "review/:id",
    element: (
      <ProtectedRoute>
        <ReviewDetail />
      </ProtectedRoute>
    ),
  },
]);

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
