import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Common/Header';
import { getTweetAPI, updateTweetAPI, deleteTweetAPI } from 'js/API';
import { follow, unFollow, enterFn } from 'js/common';
import { errorInfo } from 'js/array';

const TweetInfo = () => {
  const [info, setInfo] = useState({});
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  let prevent = false;

  const navigate = useNavigate();

  const getTweet = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getTweetAPI('all');
    if (typeof result === 'object') {
      result.data.forEach(obj => {
        if (obj.id === Number(id)) {
          setInfo(obj);
          setContent(obj.tweet);
        }
      });
    }
  };

  const editTweet = async () => {
    const result = await updateTweetAPI(id, content);
    //- 트윗 수정 완료 시 트윗 리스트를 새로 불러오고 편집 모드 해제, 편집할 트윗 아이디와 작성 기록 삭제
    if (typeof result === 'object') {
      getTweet();
      setContent('');
      setEdit(false);
    } else return alert(errorInfo[result]);
  };

  const delTweet = async id => {
    //- 트윗 아이디를 가져와 해당 아이디에 해당하는 트윗 삭제
    if (!window.confirm('정말 이 트윗을 삭제하시겠습니까?')) return;
    const result = await deleteTweetAPI(id);
    if (typeof result === 'object') {
      navigate('/home');
      return alert('삭제 되었습니다.');
    } else return alert(errorInfo[result]);
  };

  useEffect(() => {
    getTweet();
  }, []);

  return (
    <div className='container'>
      <Header />
      <div className='viewport'>
        <div className='tweetInfo'>
          <div
            className='profileInfo'
            onClick={() => navigate(`/${info.user_id}`)}>
            <img src={info.img} alt='' className='profileUserImg' />
            <h1 className='name'>{info.name}</h1>
          </div>
          {sessionStorage.getItem('myId') === info.user_id ? (
            //- 내가 작성한 트윗일 경우
            edit ? (
              //~ EditMode
              <div className='btns'>
                <div className='btn editEnd' onClick={() => editTweet()}>
                  완료
                </div>
                <div
                  className='btn cancel'
                  onClick={() => {
                    if (
                      !window.confirm(
                        '지금까지 수정한 내용은 반영되지 않습니다.\n정말 수정하지 않고 취소하시겠습니까?'
                      )
                    )
                      return;
                    setEdit(false);
                    setContent(info.tweet);
                  }}>
                  취소
                </div>
              </div>
            ) : (
              //~ Not EditMode
              <div className='btns'>
                <div
                  className={`btn edit`}
                  onClick={() => {
                    setEdit(true);
                  }}>
                  수정
                </div>
                <div className='btn del' onClick={() => delTweet(id)}>
                  삭제
                </div>
              </div>
            )
          ) : info.follow_chk ? (
            //- 내가 팔로우 한 사람일 경우 언팔로우 버튼 표시
            <div
              className='btn unFollow'
              onClick={() => {
                unFollow(info.user_id);
                getTweet();
                return;
              }}>
              UnFollow
            </div>
          ) : (
            //- 내가 팔로우 하지 않은 사람일 경우 팔로우 버튼 표시
            <div
              className={`btn ${info.follow_chk ? 'unFollow' : 'follow'}`}
              onClick={() => {
                if (info.follow_chk) {
                  unFollow(info.user_id);
                  getTweet();
                  return;
                } else {
                  follow(info.user_id);
                  getTweet();
                  return;
                }
              }}>
              {info.follow_chk ? 'UnFollow' : 'Follow'}
            </div>
          )}
          <div className='content'>
            {edit ? (
              //~ EditMode
              <textarea
                autoFocus // 자동 포커스
                className='contentArea'
                defaultValue={info.tweet} // 기본값은 트윗의 원래 내용
                onChange={e => setContent(e.target.value)}
                onKeyDown={e => enterFn(e, editTweet)}
              />
            ) : (
              //~ Not EditMode
              <div className='contentArea'>{info.tweet}</div>
            )}
            <div className={`calc ${content.length === 1000 ? 'red' : ''}`}>
              {content.length === 1000
                ? '입력 불가'
                : `입력 가능: ${1000 - content.length}자`}
            </div>
            <hr />
            <div className='commentArea'>
              <div className='comment'>
                <div
                  className='profile'
                  onClick={() => navigate(`/${info.user_id}`)}>
                  <img src={info.img} alt={info.user_id} className='userImg' />
                  <div>{info.name}</div>
                </div>
                <div className='commentContent'>
                  으아아ㅓㅇㄹ미ㅏㄴ어리마넝리ㅏㅁ넝리ㅏㅁ넝
                </div>
              </div>
            </div>
            <div className='commentInput'>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <div>전송</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetInfo;
