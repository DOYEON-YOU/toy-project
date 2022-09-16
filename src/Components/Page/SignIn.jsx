import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Common/Header';
import { signInAPI } from 'js/API';
import { enterFn } from 'js/common';
import { errorInfo } from 'js/array';
import { setCookie, getCookie } from 'js/cookie';

const SignIn = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [check, setCheck] = useState(false);
  const obj = {
    emptyBoth: false,
    emptyId: false,
    emptyPw: false,
  };
  const [formCheck, setFormCheck] = useState(obj);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = '로그인 | Moana Tweet';
    if (getCookie('myToken')) navigate('/home');
    if (localStorage.getItem('save-id')) {
      setId(localStorage.getItem('save-id'));
      setCheck(true);
    }
  }, []);

  const checkForm = async (str, bool) => {
    obj[str] = bool;
    setFormCheck(obj);
  };

  const loginFn = async () => {
    if (id.trim() === '' && pw.trim() === '')
      return checkForm('emptyBoth', true);
    else if (id.trim() === '') return checkForm('emptyId', true);
    else if (pw.trim() === '') return checkForm('emptyPw', true);
    else checkForm(obj);
    const result = await signInAPI(id, pw);
    if (result === null) return;
    if (typeof result === 'object') {
      const { access_token } = result?.data;
      setCookie('myToken', access_token, {
        path: '/'
      })
      sessionStorage.setItem('myId', id);
      if (check === true) {
        localStorage.setItem('save-id', id);
      } else localStorage.removeItem('save-id');
      navigate('/home');
    } else return alert(errorInfo[result]);
  };

  return (
    <div className='container'>
      <Header />
      <div className='viewport'>
        <div className='loginForm'>
          <h1>SIGN-IN</h1>
          <input
            type='text'
            placeholder='ID'
            className='idInput'
            autoFocus
            value={id}
            onChange={e => setId(e.target.value)}
            onKeyDown={e => enterFn(e, loginFn)}
          />
          <input
            type='password'
            placeholder='PW'
            className='pwInput'
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => enterFn(e, loginFn)}
          />
          <div className='remember_box'>
            <label htmlFor='remember'>
              <input
                type='checkbox'
                id='remember'
                checked={check}
                onChange={e => setCheck(e.target.checked)}
              />
              <span>아이디 저장</span>
            </label>
            <span>
              <Link to={'/sign-up'}>회원가입</Link>
            </span>
          </div>
          {formCheck.emptyBoth && (
            <span>
              <p className='highlight'>아이디</p>와{' '}
              <p className='highlight'>비밀번호</p>를 입력해 주세요.
            </span>
          )}
          {formCheck.emptyId && (
            <span>
              <p className='highlight'>아이디</p>를 입력해 주세요.
            </span>
          )}
          {formCheck.emptyPw && (
            <span>
              <p className='highlight'>비밀번호</p>를 입력해 주세요.
            </span>
          )}
          <div className='btn loginBtn' onClick={() => loginFn()}>
            LOGIN
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
