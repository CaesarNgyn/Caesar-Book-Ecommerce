import { Navigate, Outlet } from "react-router-dom";
import Forbidden from "../Forbidden/Forbidden";
import { useSelector } from "react-redux";
import AdminPage from "../../pages/admin/AdminPage";

const RoleBaseRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  const user = useSelector(state => state.account.user)
  const userRole = user.role
  if (isAdminRoute && userRole === 'ADMIN') {
    return (<>{props.children}</>)
  } else {
    return (<Forbidden />)
  }
}
const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)
  console.log(">>authne", isAuthenticated)
  const userRole = useSelector(state => state.account.user.role)
  // return (
  //   <>
  //     {isAuthenticated ?
  //       <>
  //         <RoleBaseRoute>
  //           {props.children}
  //         </RoleBaseRoute>
  //       </> :
  //       <Navigate to="/login" />
  //     }
  //   </>
  // )
  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  if (userRole === "ADMIN") {
    return <>{props.children}</>
  }

  if (userRole === "USER") {
    return <Forbidden />
  }

  return null;

};

export default ProtectedRoute;