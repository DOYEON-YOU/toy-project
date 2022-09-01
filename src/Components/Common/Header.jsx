import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const movePage = () => {
    if (sessionStorage.getItem('myToken')) navigate('/home');
    else navigate('/');
  };

  return (
    <div className='header'>
      <div className='title' onClick={() => movePage()}>
        MOANA-TWEET
      </div>
    </div>
  );
};

export default Header;
