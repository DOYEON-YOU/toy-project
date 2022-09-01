import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SideBar from './Common/SideBar';
import Header from './Common/Header';
import {
  getTweetAPI,
  newTweetAPI,
  updateTweetAPI,
  deleteTweetAPI,
} from 'js/API';
import { errorInfo, follow, unFollow, enterFn } from 'js/common';

const DashBoard = () => {
  const [write, setWrite] = useState(false);
  const [edit, setEdit] = useState(false);
  const [list, setList] = useState([]);
  const [view, setView] = useState('all');
  const [editIdx, setEditIdx] = useState('');
  const [content, setContent] = useState('');
  let prevent = false;

  useEffect(() => {
    document.title = '메인 | Moana Tweet';
  }, []);

  useEffect(() => {
    getTweet();
  }, [view]);

  const getTweet = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);

    const result = await getTweetAPI(view);
    if (typeof result === 'object') {
      setList(result.data);
    } else return alert(errorInfo[result]);
  };

  const newTweet = async () => {
    if (edit) return alert('수정 중에는 글을 게시할 수 없습니다.');
    if (!content) return alert('게시할 글의 내용을 적어 주세요.');
    if (content.length > 1000) {
      return alert('공백 포함 1000자까지 게시 가능합니다.');
    }
    const result = await newTweetAPI(content);
    if (typeof result === 'object') {
      getTweet();
      setWrite(false);
      setContent('');
    } else return alert(errorInfo[result]);
  };

  const editTweet = async () => {
    if (write) {
      setEdit(false);
      return alert('글을 작성하는 중에는 수정할 수 없습니다.');
    }
    const result = await updateTweetAPI(editIdx, content);
    if (typeof result === 'object') {
      getTweet();
      setContent('');
      setEdit(false);
      setEditIdx('');
    } else return alert(errorInfo[result]);
  };

  const delTweet = async id => {
    if (!window.confirm('정말 이 트윗을 삭제하시겠습니까?')) return;
    const result = await deleteTweetAPI(id);
    if (typeof result === 'object') {
      getTweet();
      return alert('삭제 되었습니다.');
    } else return alert(errorInfo[result]);
  };

  const writeTweet = e => {
    setContent(e.target.value);
    if (e.target.value.length > 1000) {
      const txt = e.target.value.substr(0, 1000);
      setContent(txt);
    }
  };

  const renderTweet = () => {
    if (list.length >= 1) {
      return list.reduce(
        (acc, { user_id, name, tweet, created_at, follow_chk, id, img }) => {
          return (
            <>
              {acc}
              <div className='tweet'>
                <div className='tweet-info'>
                  <div className='info-wrap'>
                    <Link to={`/${user_id}`} className='profile'>
                      <img src={img} alt={user_id} className='userImg' />@
                      {name}
                    </Link>
                    {sessionStorage.getItem('myId') === user_id ? (
                      id === editIdx && edit ? (
                        <>
                          <div
                            className='btn editEnd'
                            onClick={() => editTweet()}>
                            완료
                          </div>
                          <div
                            className='btn cancel'
                            onClick={() => {
                              setEdit(false);
                              setEditIdx('');
                              setContent('');
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
                      )
                    ) : view !== 'follow' ? (
                      <div
                        className={`btn ${follow_chk ? 'unFollow' : 'follow'}`}
                        onClick={() => {
                          if (follow_chk) {
                            unFollow(user_id);
                            getTweet();
                            return;
                          } else {
                            follow(user_id);
                            getTweet();
                            return;
                          }
                        }}>
                        {follow_chk ? 'UnFollow' : 'Follow'}
                      </div>
                    ) : (
                      <div
                        className='btn unFollow'
                        onClick={() => {
                          unFollow(user_id);
                          getTweet();
                          return;
                        }}>
                        UnFollow
                      </div>
                    )}
                  </div>
                  <div className='tweetDate'>
                    {created_at.replaceAll('T', ' ')}
                  </div>
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
        },
        <></>
      );
    } else {
      return (
        <>{write ? '' : <div className='noneList'>목록이 없습니다.</div>}</>
      );
    }
  };

  return (
    <div className='container'>
      <Header />
      <SideBar />
      <div className='viewport'>
        <div className='tweet-Home'>
          <h1>Tweet</h1>
          <hr />
          <div className='topBar'>
            {write ? (
              <>
                {' '}
                <div className='btn postBtn' onClick={() => newTweet()}>
                  게시
                </div>
                <div className={`calc ${content.length === 1000 ? 'red' : ''}`}>
                  {content.length === 1000
                    ? '입력 불가'
                    : `입력 가능: ${1000 - content.length}자`}
                </div>
                <div
                  className='btn cancelBtn'
                  onClick={() => {
                    setWrite(false);
                    setContent('');
                  }}>
                  취소
                </div>
              </>
            ) : (
              <>
                <div onClick={() => setWrite(true)} className='btn'>
                  글쓰기
                </div>
                <select onChange={e => setView(e.target.value)} value={view}>
                  <option value='all'>전체 트윗 보기</option>
                  <option value='my'>내 트윗 보기</option>
                  <option value='follow'>팔로우 트윗 보기</option>
                </select>
              </>
            )}
          </div>
          {write && (
            <textarea
              autoFocus
              className='writeArea'
              onChange={e => writeTweet(e)}
              value={content}
              onKeyDown={e => enterFn(e, newTweet)}></textarea>
          )}
          {renderTweet()}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
