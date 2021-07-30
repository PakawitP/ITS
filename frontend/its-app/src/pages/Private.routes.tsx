import React from 'react'
import { Route, Redirect, RouteProps } from "react-router-dom";
import { checkToken } from '../services/auth/auth'
import { RountGuest } from '../services/rountURL'




export type ProtectedRouteProps = {
  // isAuthenticated : boolean;
  redirectPath: string;
  role?: string;
} & RouteProps;


const PrivateRoute = ({ role, redirectPath, ...routeProps }: ProtectedRouteProps) => {
  let data = JSON.parse(localStorage.getItem('user') || '{}')


  return (
    <div>
      {checkToken() ? (
        <div>{data.user_role_name === 'Admin' ? (<Route {...routeProps} />) :
          <div>
            {role === "User" && data.user_role_name === "User" ? (<Route {...routeProps} />) :
              <div>
                <Redirect to={{ pathname: redirectPath }} />
              </div>
            }
          </div>}
        </div>
      ) : <Redirect to={{ pathname: RountGuest.Login }} />}

    </div>
  )

  // if (true) {
  //   if (data.user_role_name === 'Admin') {
  //     return <Route {...routeProps} />;
  //   }
  //   else if (role === "User" && data.user_role_name === "User") {
  //     return <Route {...routeProps} />;
  //   }
  //   else {
  //     return <Redirect to={{ pathname: redirectPath }} />;
  //   }
  // } else {
  //   return <Redirect to={{ pathname: RountGuest.Login }} />;
  // }
};


export default PrivateRoute