import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import { getUserAPI } from 'js/API';

const UserEdit = () => {
  const [name, setName] = useState('');
  const [pw, setPw] = useState('');
  const [info, setInfo] = useState('');
  const [img, setImg] = useState('');
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
    console.log(result);
    setPw(localStorage.getItem('myPw'));
    result.data.forEach(obj => {
      if (obj.user_id === localStorage.getItem('myId')) {
        console.log(obj);
        setInfo(obj.profile);
      }
    });
  };

  const uploadImg = e => {
    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
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
                <img src={img} alt='' />
              </div>
              <input
                type='file'
                id='imgUploader'
                accept='image/*'
                onChange={e => uploadImg(e)}
              />
              <label htmlFor='imgUploader' className='btn edit'>
                프로필 사진 수정
              </label>
            </div>
            <div className='row-wrap'>
              <div className='row'>
                <span>닉네임</span>
                <input
                  type='text'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder='닉네임'
                />
              </div>
              <div className='row'>
                <span>비밀번호</span>
                <input
                  type='password'
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder='비밀번호'
                />
              </div>
              <div className='row'>
                <span>비밀번호 확인</span>
                <input
                  type='password'
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder='비밀번호 확인'
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
          </div>
          <div className='btn save'>저장</div>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
