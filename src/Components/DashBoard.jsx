import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Common/Header';
import {
  getTweetAPI,
  newTweetAPI,
} from 'js/API';
import { errorInfo } from 'js/array';
import { enterFn } from 'js/common';

const DashBoard = () => {
  const [list, setList] = useState([]); //& Tweet List
  const [view, setView] = useState('all'); //& viewCount
  const [write, setWrite] = useState(false); //& PostMode
  const [content, setContent] = useState(''); //& Tweet Content
  let prevent = false;

  const navigate = useNavigate();

  useEffect(() => {
    document.title = '메인 | Moana Tweet';
  }, []);

  useEffect(() => {
    getTweet();
  }, [view]);

  //= 트윗 목록 불러오기
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

  //= 새 트윗 작성
  const newTweet = async () => {
    if (!content) return alert('게시할 글의 내용을 적어 주세요.');
    if (content.length > 1000) {
      return alert('공백 포함 1000자까지 게시 가능합니다.');
    }
    const result = await newTweetAPI(content);
    //- 새 트윗이 작성 완료되었을 때 트윗 리스트를 새로 불러오고 글쓰기 모드 해제 후 작성 기록 삭제
    if (typeof result === 'object') {
      getTweet();
      setWrite(false);
      setContent('');
    } else return alert(errorInfo[result]);
  };

  //= 트윗 목록 렌더링 함수
  const renderTweet = () => {
    if (list.length >= 1) {
      return list.reduce(
        (acc, { user_id, name, tweet, created_at, id, img }) => {
          return (
            <>
              {acc}
              <div className='tweet' onClick={() => navigate(`/tweet/${id}`)}>
                <div className='tweet-info'>
                  <div className='profile'>
                    <img src={img} alt={user_id} className='userImg' />@{name}
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
    } else {
      return (
        //- 목록이 없을 경우
        <>{write ? '' : <div className='noneList'>목록이 없습니다.</div>}</>
      );
    }
  };

  return (
    <div className='container'>
      <Header />
      <div className='viewport'>
        <div className='tweet-Home'>
          <h1>Tweet</h1>
          <hr />
          <div className='topBar'>
            {write ? (
              //- PostMode
              <>
                {' '}
                <div
                  className='btn cancel'
                  onClick={() => {
                    setWrite(false);
                    setContent('');
                  }}>
                  취소
                </div>
                <div className={`calc ${content.length === 1000 ? 'red' : ''}`}>
                  {content.length === 1000
                    ? '입력 불가'
                    : `입력 가능: ${1000 - content.length}자`}
                </div>
                <div className='btn postBtn' onClick={() => newTweet()}>
                  게시
                </div>
              </>
            ) : (
              //- ReadMode
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
            //- PostMode
            <textarea
              autoFocus
              className='writeArea'
              onChange={e => {
                setContent(e.target.value);
                if (e.target.value.length > 1000) {
                  const txt = e.target.value.substr(0, 1000);
                  setContent(txt);
                }
              }}
              value={content}
              onKeyDown={e => enterFn(e, newTweet)}
            />
          )}
          {renderTweet()}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
