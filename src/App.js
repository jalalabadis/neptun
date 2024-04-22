import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Page from './pages/Page';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/page' element={<Page/>}></Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
