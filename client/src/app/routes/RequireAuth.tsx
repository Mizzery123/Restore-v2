// A route guard that protects pages by checking if a user is authenticated.

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "../../features/account/accountApi"

export default function RequireAuth() {
    const {data: user, isLoading} = useUserInfoQuery();
    const location = useLocation(); // See which page user is coming from

    if (isLoading) return <div>Loading...</div>

    if (!user) {
        return <Navigate to='/login' state={{from: location}} />
    }

    const adminRoutes = [
      '/inventory',
      '/admin-dashboard' //Not created just for example for more than 1 admin route!
    ]

    if (adminRoutes.includes(location.pathname) && !user.roles.includes('Admin')){
      return <Navigate to='/' replace/> //replace instead of push so clicking back will not allow them to back admin pages!
    }

  return (
    <Outlet />
  )
}