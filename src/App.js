import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignIn from 'Components/SignIn';
import SignUp from 'Components/SignUp';
import DashBoard from 'Components/DashBoard';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/home' element={<DashBoard />} />
      </Routes>
    </div>
  );
}

export default App;
