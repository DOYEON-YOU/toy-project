import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignIn from 'Components/SignIn';
import SignUp from 'Components/SignUp';
import DashBoard from 'Components/DashBoard';
import UserList from 'Components/UserList';
import UserInfo from 'Components/UserInfo';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/home' element={<DashBoard />} />
        <Route path='/user-list' element={<UserList />} />
        <Route path='/:id' element={<UserInfo />} />
      </Routes>
    </div>
  );
}

export default App;
