import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Common/Header';
import {
  getUserAPI,
  getTweetAPI,
} from 'js/API';
import { errorInfo } from 'js/array';
import { follow, unFollow } from 'js/common';

const UserInfo = () => {
  const [user, setUser] = useState({
    name: '',
    id: '',
    profile: '',
    img: '',
    followChk: '',
  });
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
          });
        }
      });
    } else return alert(errorInfo[userData]);
  };

  const renderTweet = () => {
    return tweets.reduce(
      (acc, { user_id, name, tweet, created_at, id, img }) => {
        return (
          <>
            {acc}
            <div className='tweet' onClick={() => navigate(`/tweet/${id}`)}>
              <div className='tweet-info'>
                <div className='info-wrap'>
                  <img src={img} alt={user_id} className='userImg' />
                  <div className='userId'>@{name}</div>
                </div>
                <div className='tweetDate'>
                  {created_at.replaceAll('T', ' ')}
                </div>
              </div>
              <hr />
              <div className='tweetContent'>{tweet}</div>
            </div>
          </>
        );
      },
      <></>
    );
  };

  return (
    <div className='container'>
      <Header />
      <div className='viewport'>
        <div className='userInfo'>
          <img src={user.img} alt='' className='profileUserImg' />
          <h1 className='name'>
            {user.name}
            <span className='id'>@{user.id}</span>
          </h1>
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
