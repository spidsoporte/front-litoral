import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

// eslint-disable-next-line import/prefer-default-export, react/prop-types
export const PublicRoute = ({children}) => {
  const {isLogged} = useSelector((state) => state.auth)

  return (
    <>
      {
        !isLogged ? children : <Navigate to='/dashboard' />
      }
    </>
  )
}

