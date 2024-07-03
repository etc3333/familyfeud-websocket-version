import Home from './components/Home.js';
import GameBoard from './components/GameBoard.js';
import HostBoard from './components/HostBoard.js';

import './css/common.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/game/:gameBoardID' element={<GameBoard />}></Route>
        <Route path='/host/:hostBoardID' element={<HostBoard />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
