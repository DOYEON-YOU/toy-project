import { useState, useEffect } from 'react';
import { RiMenu4Fill } from 'react-icons/ri';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const SideBar = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const [menuBtn, setMenuBtn] = useState('close');

  const outClick = e => {
    for (let p of e.path || (e.composedPath && e.composedPath())) {
      if (p.className === 'side-bar open') return;
    }
    window.removeEventListener('click', outClick);
    setMenuBtn('close');
  };

  useEffect(() => {
    if (menuBtn === 'open') window.addEventListener('click', outClick);
    if (!sessionStorage.getItem('myToken')) {
      sessionStorage.clear();
      navigate('/');
      return alert('로그인이 필요한 서비스입니다.');
    }
  }, [menuBtn]);

  return (
    <>
      <div className={`side-bar ${menuBtn}`}>
        <ul>
          <li>
            <Link to='/home' className={path === '/home' && 'active'}>
              트윗
            </Link>
          </li>
          <li>
            <Link to='/user-list' className={path === '/user-list' && 'active'}>
              회원 목록
            </Link>
          </li>
          <li>
            <Link
              to={`/${sessionStorage.getItem('myId')}`}
              className={
                path === `/${sessionStorage.getItem('myId')}` && 'active'
              }>
              마이페이지
            </Link>
          </li>
          <li>
            <div
              onClick={() => {
                sessionStorage.clear();
                navigate('/');
              }}>
              로그아웃
            </div>
          </li>
        </ul>
      </div>
      <button
        onClick={e => {
          setMenuBtn('open');
          e.stopPropagation();
        }}
        className={`menuBtn`}>
        <RiMenu4Fill />
      </button>
    </>
  );
};

export default SideBar;
