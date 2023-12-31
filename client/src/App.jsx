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
import OrderPage from './pages/order/OrderPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import UserTable from './components/Admin/User/UserTable';
import BookTable from './components/Admin/Book/BookTable';
import './styles/cart.scss'
import './styles/reset.scss'
import HistoryPage from './pages/history/HistoryPage';
import OrderTable from './components/Admin/Order/OrderTable';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className='layout-app'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
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
        path: "book/:slug",
        element: <BookPage />,
      },
      {
        path: "order",
        element:
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ,
      },
      {
        path: "history",
        element:
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ,
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
        element: <ProtectedRoute>
          <BookTable />
        </ProtectedRoute>,
      },
      {
        path: "user",
        element: <ProtectedRoute>
          <UserTable />
        </ProtectedRoute>,
      },
      {
        path: "order",
        element: <ProtectedRoute>
          <OrderTable />
        </ProtectedRoute>,
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
  const isLoggedIn = useSelector(state => state.account.isLoggedIn)

  const getAccountInformation = async () => {
    try {
      if (isLoggedIn) {
        const response = await fetchAccount()
        if (response && response.data && response.data?.user) {
          dispatch(doGetAccount(response.data.user))
        }
      }
      if (window.location.pathname === '/login' ||
        window.location.pathname === '/register' ||
        window.location.pathname === '/'
        || window.location.pathname.startsWith('/book/')
      ) {
        return;
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
      {isLoading === false || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        || window.location.pathname.startsWith('/book/')
        ?
        <RouterProvider router={router} />
        :
        <Loading />}
    </>
  );
}
