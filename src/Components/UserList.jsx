import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import { getUserAPI } from 'js/API';
import { errorInfo, follow, unFollow } from 'js/common';
import { getCookie } from 'js/cookie';

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
    return list.reduce((acc, { user_id, profile, follow_chk }) => {
      return (
        <>
          {acc}
          <div className='user'>
            <div>
              <Link to={`/${user_id}`} className='user_id'>@{user_id}</Link>
              <div>{profile}</div>
            </div>
            {getCookie('myId') !== user_id && (
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
      <SideBar />
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
