import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../Common/Header';
import { getUserAPI, getTweetAPI } from 'js/API';
import { errorInfo } from 'js/array';
import { follow, unFollow } from 'js/common';

const UserInfo = () => {
  const [user, setUser] = useState({});
  const [tweets, setTweets] = useState([]);
  // const

  const navigate = useNavigate();
  const path = useLocation().pathname.replaceAll('/', '');
  let prevent = false;

  useEffect(() => {
    document.title = `${path}의 페이지 | Moana Tweet`;
    getUserInfo();
  }, []);

  const getTweet = async () => {
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
  };

  const getUserInfo = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);

    const userData = await getUserAPI();
    if (typeof userData === 'object') {
      userData.data.forEach(obj => {
        if (obj.user_id === path) {
          setUser(obj);
        }
      });
      getTweet();
    } else return alert(errorInfo[userData]);
  };

  const renderTweet = () => {
    return tweets.reduce(
      (acc, { user_id, name, tweet, created_at, tweet_id, img }) => {
        return (
          <>
            {acc}
            <div
              className='tweet'
              onClick={() => navigate(`/tweet/${tweet_id}`)}>
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
          <div className='userInfo-detail'>
            <div>
              <img src={user.img} alt='' className='profileUserImg' />
              <h1 className='name'>
                {user.name}
                <span className='id'>@{user.user_id}</span>
              </h1>
              <div className='profileInfo'>{user.profile}</div>
            </div>
            <div className='countUser'>
              <div className='countUserInfo'>
                <div>{tweets.length}</div>
                <div>게시글 수</div>
              </div>
              <Link to={`/${user.user_id}/follower`} className='countUserInfo'>
                <div>{user.follower_cnt}</div>
                <div>팔로워</div>
              </Link>
              <Link to={`/${user.user_id}/follow`} className='countUserInfo'>
                <div>{user.follow_cnt}</div>
                <div>팔로우</div>
              </Link>
            </div>
          </div>
          {user.user_id === sessionStorage.getItem('myId') ? (
            <div className='btn' onClick={() => navigate('/edit')}>
              회원 정보 수정
            </div>
          ) : (
            <div
              className={`btn ${user.follow_chk ? 'unFollow' : 'follow'}`}
              onClick={() => {
                if (user.follow_chk) {
                  unFollow(user.user_id);
                  getUserInfo();
                  return;
                } else {
                  follow(user.user_id);
                  getUserInfo();
                  return;
                }
              }}>
              {user.follow_chk ? 'UnFollow' : 'Follow'}
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
