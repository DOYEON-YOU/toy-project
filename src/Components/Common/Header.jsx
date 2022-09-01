import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const movePage = () => {
    console.log(path);
    if (sessionStorage.getItem('myToken')) navigate('/home');
    else navigate('/');
  };

  return (
    <div className='header'>
      <div>
        {path === '/' || path === '/sign-up' ? (
          ''
        ) : (
          <>
            <Link to='/home' className='link'>
              <div>홈</div>
            </Link>
            <Link to='/user-list' className='link'>
              <div>회원목록</div>
            </Link>
            <Link to={`/${sessionStorage.getItem('myId')}`} className='link'>
              <div>마이페이지</div>
            </Link>
            <div
              className='link'
              onClick={() => {
                sessionStorage.clear();
                navigate('/');
              }}>
              로그아웃
            </div>
          </>
        )}
      </div>
      <div className='title' onClick={() => movePage()}>
        MOANA-TWEET
      </div>
    </div>
  );
};

export default Header;
