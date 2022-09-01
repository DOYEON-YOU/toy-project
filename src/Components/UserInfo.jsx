import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import {
  getUserAPI,
  getTweetAPI,
  updateTweetAPI,
  deleteTweetAPI,
} from 'js/API';
import { errorInfo, follow, unFollow, enterFn } from 'js/common';

const UserInfo = () => {
  const [user, setUser] = useState({
    name: '',
    id: '',
    profile: '',
    img: '',
    followChk: ''
  })
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState('');
  const [editIdx, setEditIdx] = useState('');
  const [tweets, setTweets] = useState([]);

  const navigate = useNavigate();
  const path = useLocation().pathname.replaceAll('/', '');
  let prevent = false;

  useEffect(() => {
    document.title = `${path}의 페이지 | Moana Tweet`;
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);

    if (path === sessionStorage.getItem('myId')) {
      const tweetData = await getTweetAPI('my');
      if (typeof tweetData === 'object') {
        setTweets(tweetData.data);
      } else return alert(errorInfo[tweetData]);
    } else {
      const tweetData = await getTweetAPI('other_user', path);
      if (typeof tweetData === 'object') {
        setTweets(tweetData.data);
      } else return alert(errorInfo[tweetData]);
    }
    const userData = await getUserAPI();
    if (typeof userData === 'object') {
      userData.data.forEach(obj => {
        if (obj.user_id === path) {
          setUser({
            id: obj.user_id,
            name: obj.name,
            profile: obj.profile,
            followChk: obj.follow_chk,
            img: obj.img,
          })
        }
      });
    } else return alert(errorInfo[userData]);
  };

  const editTweet = async () => {
    if (content.trim() === '')
      return alert('변경 사항이 없거나 빈 문자열입니다.');
    const result = await updateTweetAPI(editIdx, content);
    if (typeof result === 'object') {
      getUserInfo();
      setContent('');
      setEdit(false);
      setEditIdx('');
    } else return alert(errorInfo[result]);
  };

  const delTweet = async id => {
    if (!window.confirm('정말 이 트윗을 삭제하시겠습니까?')) return;
    const result = await deleteTweetAPI(id);
    if (typeof result === 'object') {
      getUserInfo();
      return alert('삭제 되었습니다.');
    } else return alert(errorInfo[result]);
  };

  const renderTweet = () => {
    return tweets.reduce((acc, { user_id, name, tweet, created_at, id, img }) => {
      return (
        <>
          {acc}
          <div className='tweet'>
            <div className='tweet-info'>
              <div className='info-wrap'>
                <img src={img} alt={user_id} className='userImg' />
                <div className='userId'>@{name}</div>
                {sessionStorage.getItem('myId') === user_id &&
                  (id === editIdx && edit ? (
                    <>
                      <div className='btn editEnd' onClick={() => editTweet()}>
                        완료
                      </div>
                      <div
                        className='btn cancel'
                        onClick={() => {
                          setEdit(false);
                          setEditIdx('');
                          return alert(
                            '지금까지 수정한 내용은 반영되지 않습니다.\n정말 수정하지 않고 취소하시겠습니까?'
                          );
                        }}>
                        취소
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`btn edit`}
                        onClick={() => {
                          setEdit(true);
                          setEditIdx(id);
                        }}>
                        수정
                      </div>
                      <div className='btn del' onClick={() => delTweet(id)}>
                        삭제
                      </div>
                    </>
                  ))}
              </div>
              <div className='tweetDate'>{created_at.replaceAll('T', ' ')}</div>
            </div>
            <hr />
            <div className='tweetContent'>
              {id === editIdx && edit ? (
                <textarea
                  autoFocus
                  defaultValue={tweet}
                  onChange={e => setContent(e.target.value)}
                  onKeyDown={e => enterFn(e, editTweet)}></textarea>
              ) : (
                tweet
              )}
            </div>
          </div>
        </>
      );
    }, <></>);
  };

  return (
    <div className='container'>
      <Header />
      <SideBar />
      <div className='viewport'>
        <div className='userInfo'>
          <img src={user.img} alt='' className='profileUserImg' />
          <h1 className='name'>{user.name}<span className='id'>@{user.id}</span></h1>
          <div className='profileInfo'>{user.profile}</div>
          {user.id === sessionStorage.getItem('myId') ? (
            <div className='btn' onClick={() => navigate('/edit')}>
              회원 정보 수정
            </div>
          ) : (
            <div
              className={`btn ${user.followChk ? 'unFollow' : 'follow'}`}
              onClick={() => {
                if (user.followChk) {
                  unFollow(user.id);
                  getUserInfo();
                  return;
                } else {
                  follow(user.id);
                  getUserInfo();
                  return;
                }
              }}>
              {user.followChk ? 'UnFollow' : 'Follow'}
            </div>
          )}
          <hr />
          {renderTweet()}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
