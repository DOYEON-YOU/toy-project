import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const movePage = () => {
    if (sessionStorage.getItem('myToken')) navigate('/home');
    else navigate('/');
  };

  useEffect(() => {
    if (!sessionStorage.getItem('myToken')) {
      if (path === '/' || path === '/sign-up') return;
      else {
        navigate('/');
        return alert('로그인이 필요한 서비스입니다.');
      }
    }
  }, []);

  return (
    <div className='header'>
      <div>
        {path === '/' || path === '/sign-up' ? (
          ''
        ) : (
          <>
            <Link
              to='/home'
              className={`link ${path === '/home' ? 'active' : ''}`}>
              <div>홈</div>
            </Link>
            <Link
              to='/user-list'
              className={`link ${path === '/user-list' ? 'active' : ''}`}>
              <div>회원목록</div>
            </Link>
            <Link
              to={`/${sessionStorage.getItem('myId')}`}
              className={`link ${
                path === `/${sessionStorage.getItem('myId')}` ? 'active' : ''
              }`}>
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
