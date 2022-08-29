import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from 'js/cookie';

const Header = () => {

  const navigate = useNavigate()

  const movePage = () => {
    if (getCookie('myToken')) navigate('/home')
    else navigate('/')
  }

  return (
    <div className='header'>
      <div className='title' onClick={() => movePage()}>MOANA-TWEET</div>
    </div>
  );
};

export default Header;
