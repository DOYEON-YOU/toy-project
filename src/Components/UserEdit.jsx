import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultUserImg from 'Image/user.png';
import Header from './Common/Header';
import { getUserAPI, editUserInfoAPI, resignAPI } from 'js/API';
import { enterFn, readImage, changeState, checkForm } from 'js/common';
import { errorInfo, guideInfo } from 'js/array';

const UserEdit = () => {
  const [user, setUser] = useState({
    user_id: sessionStorage.getItem('myId'),
    password: '',
    new_password: '',
    email: '',
    name: '',
    profile: '',
    img: '',
  });
  const [newPwChk, setNewPwChk] = useState('');
  const [newPwGuide, setNewPwGuide] = useState(guideInfo.default);
  const navigate = useNavigate();
  let prevent = false;

  useEffect(() => {
    getMyInfo();
  }, []);

  const getMyInfo = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getUserAPI();
    if (typeof result === 'object') {
      result.data.forEach(obj => {
        if (obj.user_id === sessionStorage.getItem('myId')) {
          setUser(prev => {
            const clone = { ...prev };
            clone.email = obj.email;
            clone.name = obj.name;
            clone.profile = obj.profile;
            clone.img = obj.img;
            return clone;
          });
        }
      });
    }
  };

  const editUserInfo = async () => {
    if (checkForm('edit', user, setUser, newPwChk, setNewPwChk, newPwGuide)) {
      if (!window.confirm('회원 정보를 수정하시겠습니까?')) return;
      const result = await editUserInfoAPI(user);
      if (typeof result === 'object') {
        alert('회원 정보가 수정되었습니다.');
        navigate(`/${sessionStorage.getItem('myId')}`);
      } else return alert(errorInfo[result]);
    } else return;
  };

  const resign = async () => {
    if (user.password.trim() === '')
      return alert('회원 탈퇴를 진행하시려면 기존 비밀번호를 입력해 주세요.');
    if (!window.confirm('정말 탈퇴하시겠습니까?')) return;
    else {
      const result = await resignAPI(user.password);
      if (typeof result === 'object') {
        sessionStorage.clear();
        localStorage.clear();
        navigate('/');
        return alert('탈퇴가 완료되었습니다.');
      } else return alert(errorInfo[result]);
    }
  };

  return (
    <div className='container'>
      <Header />
      <div className='viewport'>
        <div className='userInfo-edit'>
          <div className='edit-wrap'>
            <div className='row-wrap'>
              <div className='profileImg'>
                <img src={user.img} alt='' />
              </div>
              <input
                type='file'
                id='imgUploader'
                accept='image/*'
                onChange={e => readImage(e.target.files[0], setUser)}
              />
              <label htmlFor='imgUploader' className='btn profileEdit'>
                프로필 사진 업로드
              </label>
              <div
                className='btn imgDelete'
                onClick={() => changeState(setUser, 'img', defaultUserImg)}>
                프로필 사진 삭제
              </div>
              <div className='btn resign' onClick={() => resign()}>
                회원 탈퇴
              </div>
            </div>
            <div className='row-wrap'>
              <div className='row'>
                <span className='notEssential'>이메일</span>
                <input
                  type='text'
                  value={user.email}
                  onChange={e => changeState(setUser, 'email', e.target.value)}
                  onKeyDown={e => enterFn(e, editUserInfo)}
                  placeholder='이메일'
                />
              </div>
              <div className='row'>
                <span className='notEssential'>닉네임</span>
                <input
                  type='text'
                  value={user.name}
                  onChange={e => changeState(setUser, 'name', e.target.value)}
                  onKeyDown={e => enterFn(e, editUserInfo)}
                  placeholder='닉네임'
                />
              </div>
              <div className='row'>
                <span>기존 비밀번호</span>
                <input
                  type='password'
                  value={user.password}
                  onChange={e =>
                    changeState(setUser, 'password', e.target.value)
                  }
                  onKeyDown={e => enterFn(e, editUserInfo)}
                  placeholder='기존 비밀번호'
                />
              </div>
              <div className='row'>
                <span className='notEssential'>새 비밀번호</span>
                <input
                  type='password'
                  value={user.new_password}
                  onChange={e => {
                    changeState(setUser, 'new_password', e.target.value);
                    if (newPwChk !== e.target.value)
                      setNewPwGuide(guideInfo.notSame);
                    else {
                      if (e.target.value.trim() === '')
                        setNewPwGuide(guideInfo.empty);
                      else setNewPwGuide(guideInfo.same);
                    }
                  }}
                  onKeyDown={e => enterFn(e, editUserInfo)}
                  placeholder='새 비밀번호'
                />
              </div>
              <div className='row pwChk'>
                <span className='notEssential'>새 비밀번호 확인</span>
                <input
                  type='password'
                  value={newPwChk}
                  onChange={e => {
                    setNewPwChk(e.target.value);
                    if (user.new_password !== e.target.value)
                      setNewPwGuide(guideInfo.notSame);
                    else {
                      if (e.target.value.trim() === '')
                        setNewPwGuide(guideInfo.empty);
                      else setNewPwGuide(guideInfo.same);
                    }
                  }}
                  onKeyDown={e => enterFn(e, editUserInfo)}
                  placeholder='새 비밀번호 확인'
                />
              </div>
              <div className='row'>
                <span className='notEssential'></span>
                <div className={newPwGuide.className}>{newPwGuide.content}</div>
              </div>
              <div className='row'>
                <span className='notEssential'>한줄소개</span>
                <input
                  type='text'
                  value={user.profile}
                  onChange={e =>
                    changeState(setUser, 'profile', e.target.value)
                  }
                  placeholder='Introduce yourself...'
                />
              </div>
            </div>
          </div>
          <div className='btn save' onClick={() => editUserInfo()}>
            저장
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
