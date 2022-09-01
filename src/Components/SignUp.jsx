import { useState, useEffect } from 'react';
import defaultUserImg from 'Image/user.png';
import { useNavigate } from 'react-router-dom';
import Header from './Common/Header';
import { errorInfo, enterFn, readImage, changeState } from 'js/common';
import { signUpAPI } from 'js/API';

const SignUp = () => {
  const [user, setUser] = useState({
    email: '',
    name: '',
    id: '',
    password: '',
    profile: '',
    img: defaultUserImg,
  });
  const [pwChk, setPwChk] = useState('');
  const [pwGuide, setPwGuide] = useState({
    content: '',
    className: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.title = '회원가입 | Moana Tweet';
  }, []);

  const signUpFn = async () => {
    const emailRegExp = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    const idRegExp = /^[a-zA-Z0-9]*$/;
    const pwRegExp = /^[A-Za-z0-9]{6,12}$/;

    if (!emailRegExp.test(user.email) || user.email.trim() === '')
      return alert('이메일을 정확히 입력해 주세요.');
    else if (user.name.trim() === '') return alert('이름을 입력해 주세요.');
    else if (user.id.trim() === '') return alert('아이디를 입력해 주세요.');
    else if (!idRegExp.test(user.id)) {
      changeState(setUser, 'id', '');
      return alert('아이디는 영문(대소문자)와 숫자만 사용 가능합니다.');
    } else if (user.password.trim() === '') return alert('비밀번호를 입력해 주세요.');
    // else if (!pwRegExp.test(user.password)) {
    //   changeState(setUser, 'pw', '');
    //   return alert(
    //     '비밀번호는 숫자와 영문 포함 6~12자리 이내만 사용 가능합니다.'
    //   );
    // } 
    else if (user.profile.trim() === '')
      return alert('한줄소개를 입력해 주세요.');
    else if (user.profile.length < 5)
      return alert('한줄소개는 최소 5글자 이상 입력해 주세요.');
    else if (user.profile.length > 30) {
      changeState(
        setUser,
        'profile',
        user.profile.slice(0, -(user.profile.length - 30))
      );
      return alert('한줄소개는 최대 30글자까지 입력 가능합니다.');
    } else {
      console.log(user)
      const result = await signUpAPI(user);
      console.log(result)
      if (typeof result === 'object') {
        alert('회원가입이 완료 되었습니다.\n로그인 페이지로 이동합니다.');
        return navigate('/');
      } else return alert(errorInfo[result]);
    }
  };

  return (
    <div className='container'>
      <Header />
      <div className='viewport'>
        <div className='signUpForm'>
          <h1>Sign-Up</h1>
          <div className='edit-wrap'>
            <div className='row-wrap'>
              <div className='profileImg'>
                <img src={user.img} alt='User_Image' />
              </div>
              <input
                type='file'
                id='imgUploader'
                accept='image/*'
                onChange={e => readImage(e.target.files[0], setUser)}
              />
              <label htmlFor='imgUploader' className='btn edit'>
                프로필 사진 업로드
              </label>
              <div
                className='btn imgDelete'
                onClick={() => changeState(setUser, 'img', defaultUserImg)}>
                {' '}
                프로필 사진 삭제
              </div>
            </div>
            <div className='row-wrap'>
              <div className='row'>
                <span>이메일</span>
                <input
                  type='text'
                  value={user.email}
                  onChange={e => changeState(setUser, 'email', e.target.value)}
                  onKeyDown={e => enterFn(e, signUpFn)}
                  placeholder='example@example.com'
                />
              </div>
              <div className='row'>
                <span>닉네임</span>
                <input
                  type='text'
                  value={user.name}
                  onChange={e => changeState(setUser, 'name', e.target.value)}
                  onKeyDown={e => enterFn(e, signUpFn)}
                  placeholder='NickName'
                />
              </div>
              <div className='row'>
                <span>아이디</span>
                <input
                  type='text'
                  value={user.id}
                  onChange={e => changeState(setUser, 'id', e.target.value)}
                  onKeyDown={e => enterFn(e, signUpFn)}
                  placeholder='ID'
                />
              </div>
              <div className='row'>
                <span>비밀번호</span>
                <input
                  type='password'
                  value={user.password}
                  onChange={e => {
                    changeState(setUser, 'password', e.target.value);
                    if (pwChk !== e.target.value)
                      return setPwGuide({
                        content: '비밀번호가 일치하지 않습니다.',
                        className: 'notSame',
                      });
                    else
                      return setPwGuide({
                        content: '비밀번호가 일치합니다.',
                        className: 'same',
                      });
                  }}
                  onKeyDown={e => enterFn(e, signUpFn)}
                  placeholder='PW'
                />
              </div>
              <div className='row pwChk'>
                <span>비밀번호 확인</span>
                <input
                  type='password'
                  value={pwChk}
                  onChange={e => {
                    setPwChk(e.target.value);
                    if (user.password !== e.target.value)
                      return setPwGuide({
                        content: '비밀번호가 일치하지 않습니다.',
                        className: 'notSame',
                      });
                    else
                      return setPwGuide({
                        content: '비밀번호가 일치합니다.',
                        className: 'same',
                      });
                  }}
                  onKeyDown={e => enterFn(e, signUpFn)}
                  placeholder='PW Check'
                />
              </div>
              <div className='row'>
                <span className='notEssential'></span>
                <div className={pwGuide.className}>{pwGuide.content}</div>
              </div>
              <div className='row'>
                <span>한줄소개</span>
                <input
                  type='text'
                  value={user.profile}
                  onChange={e =>
                    changeState(setUser, 'profile', e.target.value)
                  }
                  onKeyDown={e => enterFn(e, signUpFn)}
                  placeholder='Introduce yourself...'
                />
              </div>
            </div>
          </div>
          <div className='btn signUpBtn' onClick={() => signUpFn()}>
            회원가입
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
