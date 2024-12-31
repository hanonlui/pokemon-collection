import './App.css';
import { Route, Navigate } from 'react-router-dom';
import { Routes } from 'react-router-dom';
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
        <Route path='/pokemon-collection/' element={<HomePage/>}/>
        <Route path='/pokemon-collection/favorite' element={<FavoritePage/>}/>
        <Route path='/pokemon-collection/random' element={<RandomPage/>}/>
        <Route path='/pokemon-collection/contact' element={<ContactPage/>}/>
        <Route path='/pokemon-collection/*' element={<HomePage/>}/>
      </Routes>
    </div>
  );
}

export default App;
