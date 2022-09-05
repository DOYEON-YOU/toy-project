import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GrEdit } from 'react-icons/gr';
import {
  MdOutlineDeleteOutline,
  MdOutlineClear,
  MdCheck,
} from 'react-icons/md';
import Header from './Common/Header';
import {
  getTweetAPI,
  updateTweetAPI,
  deleteTweetAPI,
  postCommentAPI,
  getCommentAPI,
  editCommentAPI,
  delCommentAPI,
} from 'js/API';
import { follow, unFollow, enterFn } from 'js/common';
import { errorInfo } from 'js/array';

const TweetInfo = () => {
  const [info, setInfo] = useState({});
  const [content, setContent] = useState('');
  const [edit, setEdit] = useState(false);
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [commentEdit, setCommentEdit] = useState(false);
  const [commentEditContent, setCommentEditContent] = useState('');
  const [commentEditIdx, setCommentEditIdx] = useState('');

  const { id } = useParams();
  let prevent = false;

  const navigate = useNavigate();

  const getComment = async () => {
    const result = await getCommentAPI(id);
    if (typeof result === 'object') {
      setCommentList(result.data);
    } else return alert(errorInfo[result]);
  };

  const getTweet = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getTweetAPI('all');
    if (typeof result === 'object') {
      result.data.forEach(obj => {
        if (obj.tweet_id === Number(id)) {
          setInfo(obj);
          setContent(obj.tweet);
          getComment();
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

  const postComment = async () => {
    const result = await postCommentAPI(info.tweet_id, comment);
    if (typeof result === 'object') {
      getComment();
      setComment('');
    } else return alert(errorInfo[result]);
  };

  const editComment = async () => {
    const result = await editCommentAPI(commentEditIdx, commentEditContent);
    if (typeof result === 'object') {
      setCommentEdit(false);
      getComment();
    } else return alert(errorInfo[result]);
  };

  const delComment = async comment_id => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    const result = await delCommentAPI(comment_id);
    if (typeof result === 'object') {
      alert('삭제되었습니다.');
      getComment();
    } else return alert(errorInfo[result]);
  };

  const renderComment = () => {
    if (commentList.length >= 1) {
      return commentList.reduce(
        (acc, { user_id, name, img, comment, comment_id, created_at }) => {
          return (
            <>
              {acc}
              <div className='comment'>
                <div
                  className='profile'
                  onClick={() => navigate(`/${user_id}`)}>
                  <img src={img} alt={user_id} className='userImg' />
                  <div>{name}</div>
                </div>
                {comment_id === commentEditIdx && commentEdit ? (
                  <textarea
                    autoFocus
                    defaultValue={comment}
                    className='commentContent txt'
                    onChange={e => setCommentEditContent(e.target.value)}
                    onKeyDown={e => enterFn(e, editComment)}
                  />
                ) : (
                  <div className='commentContent'>{comment}</div>
                )}
                <div className='info'>
                  {sessionStorage.getItem('myId') === user_id ? (
                    <div className='btns'>
                      {comment_id === commentEditIdx && commentEdit ? (
                        <>
                          <MdCheck onClick={() => editComment()} />
                          <MdOutlineClear
                            onClick={() => {
                              if (!window.confirm('수정을 취소하시겠습니까?'))
                                return;
                              setCommentEditContent(comment);
                              setCommentEdit(false);
                              setCommentEditIdx('');
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <GrEdit
                            onClick={() => {
                              setCommentEdit(true);
                              setCommentEditIdx(comment_id);
                            }}
                          />
                          <MdOutlineDeleteOutline
                            onClick={() => delComment(comment_id)}
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    user_id === sessionStorage.getItem('myId') && (
                      <>
                        <div className='btns'>
                          <MdOutlineDeleteOutline />
                        </div>
                      </>
                    )
                  )}
                  {created_at.replaceAll('T', ' ')}
                </div>
              </div>
            </>
          );
        },
        <></>
      );
    } else return <></>;
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
            <div className='commentArea'>{renderComment()}</div>
            <div className='commentInput'>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => enterFn(e, postComment)}
              />
              <div onClick={() => postComment()}>전송</div>
            </div>
            <div className={`calc ${content.length === 1000 ? 'red' : ''}`}>
              {comment.length === 1000
                ? '입력 불가'
                : `입력 가능: ${1000 - comment.length}자`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetInfo;
