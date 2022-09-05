import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import Header from './Common/Header';
import { getFollowAPI } from 'js/API';
import { errorInfo } from 'js/array';
import { follow, unFollow } from 'js/common';

const FollowList = () => {
  const [list, setList] = useState([]);

  const path = useLocation().pathname;
  const { status } = useParams();
  const navigate = useNavigate();
  const targetUserId = path.split('/')[1];
  let prevent = false;

  useEffect(() => {
    getFollowList();
    if (!(status === 'follower' || status === 'follow')) {
      navigate(`/${targetUserId}`);
      return alert('잘못된 접근입니다.');
    }
  }, []);

  const getFollowList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);

    const result = await getFollowAPI(status, targetUserId);
    if (typeof result === 'object') {
      setList(result.data);
    } else return alert(errorInfo[result]);
  };

  const renderList = () => {
    return list.reduce(
      (acc, { follow_user_id, name, profile, img, follow_chk }) => {
        return (
          <>
            {acc}
            <div className='user'>
              <div>
                <Link to={`/${follow_user_id}`} className='profile'>
                  <img src={img} alt={follow_user_id} className='userImg' />@
                  {name}
                </Link>
                <div>{profile}</div>
              </div>
              {sessionStorage.getItem('myId') !== follow_user_id && (
                <div
                  className={`btn ${follow_chk ? 'unFollow' : 'follow'}`}
                  onClick={() => {
                    if (follow_chk) {
                      unFollow(follow_user_id);
                      getFollowList();
                      return;
                    } else {
                      follow(follow_user_id);
                      getFollowList();
                      return;
                    }
                  }}>
                  {follow_chk ? 'UnFollow' : 'Follow'}
                </div>
              )}
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
        <div className='followList'>
          <h1>
            {status === 'follower' && 'Follower'}
            {status === 'follow' && 'Following'}
          </h1>
          {renderList()}
        </div>
      </div>
    </div>
  );
};

export default FollowList;
