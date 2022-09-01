import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignIn from 'Components/SignIn';
import SignUp from 'Components/SignUp';
import DashBoard from 'Components/DashBoard';
import UserList from 'Components/UserList';
import UserInfo from 'Components/UserInfo';
import UserEdit from 'Components/UserEdit';
import TweetInfo from 'Components/TweetInfo';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/home' element={<DashBoard />} />
        <Route path='/user-list' element={<UserList />} />
        <Route path='/:id' element={<UserInfo />} />
        <Route path='/edit' element={<UserEdit />} />
        <Route path='/tweet/:id' element={<TweetInfo />} />
      </Routes>
    </div>
  );
}

export default App;
