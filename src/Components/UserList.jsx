import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Common/Header';
import { getUserAPI } from 'js/API';
import { errorInfo } from 'js/array';
import { follow, unFollow } from 'js/common';

const UserList = () => {
  const [list, setList] = useState([]);
  let prevent = false;

  useEffect(() => {
    document.title = '회원 목록 | Moana Tweet';
    getUserList();
  }, []);

  const getUserList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getUserAPI();
    if (typeof result === 'object') setList(result.data);
    else return alert(errorInfo[result]);
  };

  const renderList = () => {
    return list.reduce((acc, { user_id, name, profile, follow_chk, img }) => {
      return (
        <>
          {acc}
          <div className='user'>
            <div>
              <Link to={`/${user_id}`} className='profile'>
                <img src={img} alt={user_id} className='userImg' />@{name}
              </Link>
              <div>{profile}</div>
            </div>
            {sessionStorage.getItem('myId') !== user_id && (
              <div
                className={`btn ${follow_chk ? 'unFollow' : 'follow'}`}
                onClick={() => {
                  if (follow_chk) {
                    unFollow(user_id);
                    getUserList();
                    return;
                  } else {
                    follow(user_id);
                    getUserList();
                    return;
                  }
                }}>
                {follow_chk ? 'UnFollow' : 'Follow'}
              </div>
            )}
          </div>
        </>
      );
    }, <></>);
  };

  return (
    <div className='container'>
      <Header />
      <div className='viewport'>
        <div className='userList'>
          <h1>User List</h1>
          {renderList()}
        </div>
      </div>
    </div>
  );
};

export default UserList;
