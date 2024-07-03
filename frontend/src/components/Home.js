import '../css/Home.css';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  function navigation(path) {
    navigate(path);
  }

  function enterChecker(e) {
    if (e.key === 'Enter' && code !== '') {
      navigation(`/host/${code}`);
    }
  }

  function generateRandomCode() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  return (
    <div id="home-container">
      <div id="nav-box">
        <div>
          <div style={{zIndex: 1}}>
            <div className="gradient-text-game" onClick={() => navigation(`/game/${generateRandomCode()}`)} style={{cursor: 'pointer'}}>
              New Game
            </div>
            <hr></hr>
            <div id="host-box">
              <div className="gradient-text-host">Become Host</div>
              <div className='input-container'>
                <input type="text" placeholder="Insert Game Code" value={code} onKeyDown={(e) => enterChecker(e)} onChange={(e) => setCode(e.target.value)} />
                {code === '' ? null : <span><span>&#10132;</span></span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Home;