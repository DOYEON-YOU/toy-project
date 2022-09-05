import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignIn from 'Components/Page/SignIn';
import SignUp from 'Components/Page/SignUp';
import DashBoard from 'Components/Page/DashBoard';
import UserList from 'Components/Page/UserList';
import UserInfo from 'Components/Page/UserInfo';
import UserEdit from 'Components/UserEdit';
import TweetInfo from 'Components/TweetInfo';
import FollowList from 'Components/FollowList';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/home' element={<DashBoard />} />
        <Route path='/user-list' element={<UserList />} />
        <Route path='/:id' element={<UserInfo />} />
        <Route path='/:id/:status' element={<FollowList />} />
        <Route path='/edit' element={<UserEdit />} />
        <Route path='/tweet/:id' element={<TweetInfo />} />
      </Routes>
    </div>
  );
}

export default App;
