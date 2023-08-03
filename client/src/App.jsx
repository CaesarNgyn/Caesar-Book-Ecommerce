import React, { useEffect, useState } from 'react';
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
import RegisterPage from './pages/register/RegisterPage';
import { fetchAccount } from './services/apiServices';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccount, doLogin } from './redux/account/accountSlice';
import Loading from './components/Loading/Loading';
import NotFound from './components/Not Found/NotFound';
import AdminPage from './pages/admin/AdminPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import './styles/Reset.scss';
import UserTable from './components/Admin/User/UserTable';


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
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "book",
        element: <BookPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    errorElement: <NotFound />,
    children: [
      {
        index: true, element:
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
      },
      {
        path: "book",
        element: <BookPage />,
      },
      {
        path: "user",
        element: <UserTable />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);




export default function App() {
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.account.isLoading)

  const getAccountInformation = async () => {
    try {
      if (window.location.pathname === '/login' ||
        window.location.pathname === '/register'

      ) {
        return;
      }
      const response = await fetchAccount()
      if (response && response.data && response.data?.user) {
        dispatch(doGetAccount(response.data.user))
      }

    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  useEffect(() => {
    // Call the function to fetch data when the component mounts
    getAccountInformation();
  }, []);



  return (
    <>
      {isLoading === false || window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/' ?
        <RouterProvider router={router} />
        :
        <Loading />}
    </>
  );
}
