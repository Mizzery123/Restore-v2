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


  return (
    <Outlet />
  )
}