import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import {
  getUserAPI,
  getTweetAPI,
  updateTweetAPI,
  deleteTweetAPI,
} from 'js/API';
import { getCookie } from 'js/cookie';
import { errorInfo, follow, unFollow, enterFn } from 'js/common';

const UserInfo = () => {
  const [profile, setProfile] = useState('');
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState('');
  const [editIdx, setEditIdx] = useState('');
  const [tweets, setTweets] = useState([]);
  const [followChk, setFollowChk] = useState('');

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

    if (path === getCookie('myId')) {
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
          setProfile(obj.profile);
          setFollowChk(obj.follow_chk);
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
    return tweets.reduce((acc, { user_id, tweet, created_at, id }) => {
      return (
        <>
          {acc}
          <div className='tweet'>
            <div className='tweet-info'>
              <div className='info-wrap'>
                <div className='userId'>@{user_id}</div>
                {getCookie('myId') === user_id &&
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
          <h1 className='id'>@{path}</h1>
          <div className='profile'>{profile}</div>
          {path === getCookie('myId') ? (
            ''
          ) : (
            <div
              className={`btn ${followChk ? 'unFollow' : 'follow'}`}
              onClick={() => {
                if (followChk) {
                  unFollow(path);
                  getUserInfo();
                  return;
                } else {
                  follow(path);
                  getUserInfo();
                  return;
                }
              }}>
              {followChk ? 'UnFollow' : 'Follow'}
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
