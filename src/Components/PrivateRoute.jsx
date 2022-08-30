import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from 'js/cookie';

const PrivateRoute = ({ children }) => {
    if(!getCookie('myToken')) {
      <Navigate to="/" replace />
      return alert('로그인이 필요한 서비스입니다.')
    }
    return children;
}

export default PrivateRoute;