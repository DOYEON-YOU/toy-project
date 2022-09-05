import { useState, useEffect } from 'react';
import defaultUserImg from 'Image/user.png';
import { useNavigate } from 'react-router-dom';
import Header from '../Common/Header';
import { errorInfo, guideInfo } from 'js/array';
import { enterFn, readImage, changeState, checkForm } from 'js/common';
import { signUpAPI } from 'js/API';

const SignUp = () => {
  const [user, setUser] = useState({
    email: '',
    name: '',
    user_id: '',
    password: '',
    profile: '',
    img: defaultUserImg,
  });
  const [pwChk, setPwChk] = useState('');
  const [pwGuide, setPwGuide] = useState(guideInfo.default);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = '회원가입 | Moana Tweet';
  }, []);

  const signUpFn = async () => {
    if (checkForm('signUp', user, setUser, pwChk, setPwChk, pwGuide)) {
      const result = await signUpAPI(user);
      if (typeof result === 'object') {
        alert('회원가입이 완료 되었습니다.\n로그인 페이지로 이동합니다.');
        return navigate('/');
      } else return alert(errorInfo[result]);
    } else return;
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
                  value={user.user_id}
                  onChange={e =>
                    changeState(setUser, 'user_id', e.target.value)
                  }
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
                    if (pwChk !== e.target.value) setPwGuide(guideInfo.notSame);
                    else {
                      if (e.target.value.trim() === '')
                        setPwGuide(guideInfo.empty);
                      else setPwGuide(guideInfo.same);
                    }
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
                      setPwGuide(guideInfo.notSame);
                    else {
                      if (e.target.value.trim() === '')
                        setPwGuide(guideInfo.empty);
                      else setPwGuide(guideInfo.same);
                    }
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
