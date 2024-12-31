import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar'
import HomePage from './components/Home';
import RandomPage from './components/Random';
import FavoritePage from './components/Favorite';
import ContactPage from './components/Contact';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/favorite' element={<FavoritePage/>}/>
        <Route path='/random' element={<RandomPage/>}/>
        <Route path='/contact' element={<ContactPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
