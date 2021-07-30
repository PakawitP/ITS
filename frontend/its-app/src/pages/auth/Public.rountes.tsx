import { Route, Redirect, RouteProps } from "react-router-dom";


export type ProtectedRouteProps = {
  redirectPath: string;
} & RouteProps;


const PublicRoute = ({ redirectPath, ...routeProps }: ProtectedRouteProps) => {
  return (
    <div>
      {!localStorage.getItem('user') ? <Route {...routeProps} />
        :
        <Redirect to={{ pathname: redirectPath }} />}
    </div>
  )
  // if(!localStorage.getItem('user')) {
  //   return <Route {...routeProps} />;
  // } else {
  //   return <Redirect to={{ pathname: redirectPath }} />;  
  // }
};


export default PublicRoute