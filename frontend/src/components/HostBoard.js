import { useEffect, useState } from 'react';
import '../css/HostBoard.css';
import { useParams } from 'react-router-dom';

const HostBoard = () => {
  let { hostBoardID } = useParams();
  const [webSocket, setWebSocket] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [IPAddressServer, setIPAddressServer] = useState('');

  const groupID = hostBoardID;

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
        type: 'join',
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
    let newData = {...currentData, [location]: !currentData[location]};
    setCurrentData(newData);
    webSocket.send(JSON.stringify({
      type: 'updateCurrentGame',
      groupID,
      data: newData
    }));
  }

  function reRoll() {
    webSocket.send(JSON.stringify({
      type: 'reRoll',
      groupID
    }))
  }

  function enterChecker(e) {
    if (e.key === 'Enter' && IPAddressServer !== '') {
      setUpWebSocket();
    }
  }

  if (currentData !== null) {
    return (
      <div id='hostboard-container'>
        <div>
          <h1>
            {currentData.question}
          </h1>
          <div className='board-grid'>
            <div onClick={() => toggleShow('r1c1')}>
              {currentData.answer1 === undefined ? <div>&nbsp;</div> : 
                (<div className='host-answer-container'>
                  <span className="answer-container">{currentData.answer1}</span>
                  <span className="number-container">{currentData.number1}</span>
                </div>)
              }
            </div>
            <div onClick={() => toggleShow('r2c1')}>
              {currentData.answer2 === undefined ? <div>&nbsp;</div> : 
                (<div className='host-answer-container'>
                  <span className="answer-container">{currentData.answer2}</span>
                  <span className="number-container">{currentData.number2}</span>
                </div>)
              }
            </div>
            <div onClick={() => toggleShow('r3c1')}>
              {currentData.answer3 === undefined ? <div>&nbsp;</div> : 
                (<div className='host-answer-container'>
                  <span className="answer-container">{currentData.answer3}</span>
                  <span className="number-container">{currentData.number3}</span>
                </div>)
              }
            </div>
            <div onClick={() => toggleShow('r4c1')}>
              {currentData.answer4 === undefined ? <div>&nbsp;</div> : 
                (<div className='host-answer-container'>
                  <span className="answer-container">{currentData.answer4}</span>
                  <span className="number-container">{currentData.number4}</span>
                </div>)
              }
            </div>
            <div onClick={() => toggleShow('r1c2')}>
              {currentData.answer5 === undefined ? <div>&nbsp;</div> : 
                (<div className='host-answer-container'>
                  <span className="answer-container">{currentData.answer5}</span>
                  <span className="number-container">{currentData.number5}</span>
                </div>)
              }
            </div>
            <div onClick={() => toggleShow('r2c2')}>
              {currentData.answer6 === undefined ? <div>&nbsp;</div> : 
                (<div className='host-answer-container'>
                  <span className="answer-container">{currentData.answer6}</span>
                  <span className="number-container">{currentData.number6}</span>
                </div>)
              }
            </div>
            <div onClick={() => toggleShow('r3c2')}>
              {currentData.answer7 === undefined ? <div>&nbsp;</div> : 
                (<div className='host-answer-container'>
                  <span className="answer-container">{currentData.answer7}</span>
                  <span className="number-container">{currentData.number7}</span>
                </div>)
              }
            </div>
            <div onClick={() => toggleShow('r4c2')}>
              {currentData.answer8 === undefined ? <div>&nbsp;</div> : 
                (<div className='host-answer-container'>
                  <span className="answer-container">{currentData.answer8}</span>
                  <span className="number-container">{currentData.number8}</span>
                </div>)
              }
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
            <button onClick={reRoll}>Reroll</button>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div id='hostboard-container'>
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
};

export default HostBoard;