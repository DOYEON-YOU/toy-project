import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultUserImg from 'Image/user.png';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import { getUserAPI, editUserInfoAPI } from 'js/API';
import { readImage, changeState, errorInfo } from 'js/common';

const UserEdit = () => {
  const [user, setUser] = useState({
    id: sessionStorage.getItem('myId'),
    password: '',
    new_password: '',
    email: '',
    name: '',
    profile: '',
    img: '',
  });
  const [newPwChk, setNewPwChk] = useState('');
  const [newPwGuide, setNewPwGuide] = useState({
    content: '',
    className: '',
  });
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
    if (user.password === '')
      return alert('프로필을 수정하시려면 기존 비밀번호를 입력해 주세요.');
    else if (user.new_password && newPwChk === '')
      return alert('비밀번호를 변경하시려면 새 비밀번호 확인이 필요합니다.');
    else {
      if (!window.confirm('회원 정보를 수정하시겠습니까?')) return;
      const result = await editUserInfoAPI(user);
      if (typeof result === 'object') {
        alert('회원 정보가 수정되었습니다.');
        navigate(`/${sessionStorage.getItem('myId')}`);
      } else return alert(errorInfo[result]);
    }
  };

  return (
    <div className='container'>
      <Header />
      <SideBar />
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
              <label htmlFor='imgUploader' className='btn edit'>
                프로필 사진 업로드
              </label>
              <div
                className='btn imgDelete'
                onClick={() => changeState(setUser, 'img', defaultUserImg)}>
                프로필 사진 삭제
              </div>
            </div>
            <div className='row-wrap'>
              <div className='row'>
                <span className='notEssential'>이메일</span>
                <input
                  type='text'
                  value={user.email}
                  onChange={e => changeState(setUser, 'email', e.target.value)}
                  placeholder='이메일'
                />
              </div>
              <div className='row'>
                <span className='notEssential'>닉네임</span>
                <input
                  type='text'
                  value={user.name}
                  onChange={e => changeState(setUser, 'name', e.target.value)}
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
                      setNewPwGuide({
                        content: '비밀번호가 일치하지 않습니다.',
                        className: 'notSame',
                      });
                    else
                      setNewPwGuide({
                        content: '비밀번호가 일치합니다.',
                        className: 'same',
                      });
                  }}
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
                      setNewPwGuide({
                        content: '비밀번호가 일치하지 않습니다.',
                        className: 'notSame',
                      });
                    else
                      setNewPwGuide({
                        content: '비밀번호가 일치합니다.',
                        className: 'same',
                      });
                  }}
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
