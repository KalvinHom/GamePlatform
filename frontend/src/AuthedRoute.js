
import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import UserContext from "./contexts/UserContext";

const AuthedRoute = ({ component: Component, ...rest }) => {

  // Add your own authentication on the below line.
  const { user: user, updateUser: updateUser } = useContext(UserContext);

  const isLoggedIn = !!user
  console.log("auth route")
  console.log(user);
  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { referrer: props.location } }} />
        )
      }
    />
  )
}

export default AuthedRoute