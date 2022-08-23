import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

// eslint-disable-next-line import/prefer-default-export, react/prop-types
export const PrivateRoute = ({ children, permissions }) => {
  const { isLogged } = useSelector((state) => state.auth);
  const { rol } = useSelector((state) => state.auth.user.user);
  let loop = true
  let permission = false
  let i = 0

  if (permissions) {
    while (loop) {
      if (rol === permissions[i]){
        permission = true
        loop = false
      }
      if (!permissions[i]){
        loop = false
      }
      
      i += 1
    }
  }else{
    permission = true
  }

  return <>{isLogged && permission ? children : <Navigate to="/auth" />}</>;
};
