import './App.css';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from 'Components/PrivateRoute';
import PublicRoute from 'Components/PublicRoute';
import SignIn from 'Components/SignIn';
import SignUp from 'Components/SignUp';
import DashBoard from 'Components/DashBoard';
import UserList from 'Components/UserList';
import UserInfo from 'Components/UserInfo';
import UserEdit from 'Components/UserEdit';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={
          <PublicRoute restricted={true}>
            <SignIn />
          </PublicRoute>
        } />
        <Route path='/sign-up' element={
          <PublicRoute restricted={true}>
            <SignUp />
          </PublicRoute>
        } />
        <Route path='/home' element={
          <PrivateRoute>
            <DashBoard />
          </PrivateRoute>
        } />
        <Route path='/user-list' element={
          <PrivateRoute>
            <UserList />
          </PrivateRoute>
        } />
        <Route path='/:id' element={
          <PrivateRoute>
            <UserInfo />
          </PrivateRoute>
        } />
        <Route path='/edit' element={
          <PrivateRoute>
            <UserEdit />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
