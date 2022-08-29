import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Common/Header';
import { errorInfo } from 'js/common';
import { signUpAPI } from 'js/API';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [info, setInfo] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    document.title = '회원가입 | Moana Tweet';
  }, []);

  const signUpFn = async () => {
    const emailRegExp = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    const idRegExp = /^[a-zA-Z0-9]*$/;
    const pwRegExp = /^[A-Za-z0-9]{6,12}$/;

    if (!emailRegExp.test(email) || email.trim() === '')
      return alert('이메일을 정확히 입력해 주세요.');
    else if (name.trim() === '') return alert('이름을 입력해 주세요.');
    else if (id.trim() === '') return alert('아이디를 입력해 주세요.');
    else if (!idRegExp.test(id)) {
      setId('');
      return alert('아이디는 영문(대소문자)와 숫자만 사용 가능합니다.');
    } else if (pw.trim() === '') return alert('비밀번호를 입력해 주세요.');
    else if (!pwRegExp.test(pw)) {
      setPw('');
      return alert(
        '비밀번호는 숫자와 영문 포함 6~12자리 이내만 사용 가능합니다.'
      );
    } else if (info.trim() === '') return alert('한줄소개를 입력해 주세요.');
    else if (info.length < 5)
      return alert('한줄소개는 최소 5글자 이상 입력해 주세요.');
    else if (info.length > 30) {
      setInfo(info.slice(0, -(info.length - 30)));
      return alert('한줄소개는 최대 30글자까지 입력 가능합니다.');
    } else {
      const query = {
        email: email,
        id: id,
        name: name,
        password: pw,
        profile: info
      }
      const result = await signUpAPI(query);
      if (typeof result === 'object') {
        alert('회원가입이 완료 되었습니다.\n로그인 페이지로 이동합니다.')
        return navigate('/')
      } else return alert(errorInfo[result])
    }
  };

  return (
    <div className='container'>
      <Header />
      <div className='viewport'>
        <div className='signUpForm'>
          <h1>Sign-Up</h1>
          <div className='row-wrap'>
            <div className='row'>
              <span>이메일</span>
              <input
                type='text'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='example@example.com'
              />
            </div>
            <div className='row'>
              <span>이름</span>
              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Name'
              />
            </div>
            <div className='row'>
              <span>아이디</span>
              <input
                type='text'
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder='ID'
              />
            </div>
            <div className='row'>
              <span>비밀번호</span>
              <input
                type='password'
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder='PW'
              />
            </div>
            <div className='row'>
              <span>한줄소개</span>
              <input
                type='text'
                value={info}
                onChange={e => setInfo(e.target.value)}
                placeholder='Introduce yourself...'
              />
            </div>
          </div>
          <div className='signUpBtn' onClick={() => signUpFn()}>
            회원가입
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
