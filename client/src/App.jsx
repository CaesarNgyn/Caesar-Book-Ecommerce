import React, { useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login/LoginPage';
import Header from './components/Header/Header';

import Footer from './components/Footer/Footer';
import BookPage from './pages/book/BookPage';
import Home from './components/Home/Home';

const Layout = () => {
  return (
    <div className='layout-app'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>404 Not Found</div>,
    children: [
      { index: true, element: <Home /> },
      {
        path: "book",
        element: <BookPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);


export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
