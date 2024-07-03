import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import '../css/GameBoard.css';

import Display from './Display';

const GameBoard = () => {
  let { gameBoardID } = useParams();
  const [webSocket, setWebSocket] = useState(null);
  const [currentData, setCurrentData] = useState();
  const [IPAddressServer, setIPAddressServer] = useState('');
  const groupID = gameBoardID;
  
  useEffect(() => {
    return () => {
      closeWebSocket();
    };
  },[]);

  function closeWebSocket() {
    if (webSocket !== null) {
      webSocket.close();
      console.log('WebSocket closed');
      setWebSocket(null);
    }
  }

  function setUpWebSocket() {
    console.log('websocket started');
    const ws = new WebSocket(`ws://${IPAddressServer}:8080`);

    // Event handler for when the WebSocket connection is open
    ws.onopen = () => {
      console.log('WebSocket connection opened');
      ws.send(JSON.stringify({
        type: 'create',
        groupID,
      }));
    };

    // Event handler for incoming messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'gameInfo') {
        setCurrentData(data.data);
      }
    };

    setWebSocket(ws);
  }

  function toggleShow(location) {
/*     let newData = {...currentData, [location]: !currentData[location]};
    setCurrentData(newData);
    webSocket.send(JSON.stringify({
      type: 'updateCurrentGame',
      groupID,
      data: newData
    })); */
  }

  function enterChecker(e) {
    if (e.key === 'Enter' && IPAddressServer !== '') {
      console.log('ejflkjeflkjelfkj')
      setUpWebSocket();
    }
  }

  function openModal(id) {
    let ref = document.getElementById(id);
    ref.style.display = 'block';
  }

  function closeModal(id) {
    let ref = document.getElementById(id);
    ref.style.display = 'none';
  }

  if (currentData != null) {
    return (
      <div id='gameboard-container'>
        <div>
          <div className='settings-button'>
            <div id='settings-modal' className='modal-container'>
              <div className='modal-content'>
                <h2>Settings</h2>
                <div>
                  Code: {groupID}
                </div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <button onClick={() => closeModal('settings-modal')}>Close</button>
                </div>
              </div>
            </div>
            <div>
              <button onClick={() => openModal('settings-modal')}>Settings</button>
            </div>
          </div>
          <h1>
            {currentData.question}
          </h1>
          <div className='board-grid'>
            <div onClick={() => toggleShow('r1c1')}>
              <Display location={1} answer={currentData.answer1} number={currentData.number1} showAnswer={currentData.r1c1} />
            </div>
            <div onClick={() => toggleShow('r1c2')}>
              <Display location={2} answer={currentData.answer2} number={currentData.number2} showAnswer={currentData.r2c1} />
            </div>
            <div onClick={() => toggleShow('r2c1')}>
              <Display location={3} answer={currentData.answer3} number={currentData.number3} showAnswer={currentData.r3c1} />
            </div>
            <div onClick={() => toggleShow('r2c2')}>
              <Display location={4} answer={currentData.answer4} number={currentData.number4} showAnswer={currentData.r4c1} />
            </div>
            <div onClick={() => toggleShow('r3c1')}>
              <Display location={5} answer={currentData.answer5} number={currentData.number5} showAnswer={currentData.r1c2} />
            </div>
            <div onClick={() => toggleShow('r3c2')}>
              <Display location={6} answer={currentData.answer6} number={currentData.number6} showAnswer={currentData.r2c2} />
            </div>
            <div onClick={() => toggleShow('r4c1')}>
              <Display location={7} answer={currentData.answer7} number={currentData.number7} showAnswer={currentData.r3c2} />
            </div>
            <div onClick={() => toggleShow('r4c2')}>
              <Display location={8} answer={currentData.answer8} number={currentData.number8} showAnswer={currentData.r4c2} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div id='gameboard-container'>
        <div className='IP-input-container'>
          <div>
            Please Enter Private IP Address to find Host Device on Local Network
            <div className='input-container'>
              <input type='text' placeholder='Insert IP Adress' value={IPAddressServer} onChange={e => setIPAddressServer(e.target.value)} onKeyDown={enterChecker}/>
              {IPAddressServer === '' ? null : <span><span>&#10132;</span></span>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GameBoard;