const express = require('express');
const WebSocket = require('ws');
const ip = require('ip');

const questions3 = require('./FamilyFeudQuestions/questions3.json');
const questions4 = require('./FamilyFeudQuestions/questions4.json');
const questions5 = require('./FamilyFeudQuestions/questions5.json');
const questions6 = require('./FamilyFeudQuestions/questions6.json');
const questions7 = require('./FamilyFeudQuestions/questions7.json');

const app = express();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
//set up game with adding required variables
function reRoll() {
  let locations = {
    'r1c1': false,
    'r1c2': false,
    'r2c1': false,
    'r2c2': false,
    'r3c1': false,
    'r3c2': false,
    'r4c1': false,
    'r4c2': false
  };
  const choices = [questions3, questions4, questions5, questions6, questions7];
  let temp = choices[getRndInteger(0,choices.length - 1)];
  let gameObject = JSON.parse(JSON.stringify(temp[getRndInteger(0, temp.length - 1)]));
  return {...gameObject, ...locations};
};

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

const gamesConnections = new Map();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Message handler
  ws.on('message', (message) => {
    let messageObject = {
      type: null,
      groupID: message.groupID,
      data: null,
      message: null,
    };

    const data = JSON.parse(message);

    if (data.type == 'create') {
      let result = reRoll();
      gamesConnections.set(data.groupID, {
        currentGame: result, 
        group: [ws]
      });
      if (ws.readyState === WebSocket.OPEN) {
        messageObject.type = 'gameInfo';
        messageObject.data = result;
        ws.send(JSON.stringify(messageObject));
      }
      console.log(`Group Create: ${data.groupID}`)
    } else if (data.type == 'join') {
      const game = gamesConnections.get(data.groupID);
      game.group.push(ws);
      if (ws.readyState === WebSocket.OPEN) {
        messageObject.type = 'gameInfo';
        messageObject.data = game.currentGame;
        ws.send(JSON.stringify(messageObject));
      }
      console.log(`Group Joined: ${data.groupID}`)
    } else if (data.type == 'updateCurrentGame') {
      const game = gamesConnections.get(data.groupID);
      game.currentGame = data.data;
      game.group.forEach(conn => {
        if (conn !== ws && conn.readyState === WebSocket.OPEN) {
          messageObject.type = 'gameInfo';
          messageObject.data = data.data;
          conn.send(JSON.stringify(messageObject));
        }
      });
    } else if (data.type === 'reRoll') {
      const game = gamesConnections.get(data.groupID);
      let result = reRoll();
      game.currentGame = result;
      game.group.forEach(conn => {
        if (conn.readyState === WebSocket.OPEN) {
          messageObject.type = 'gameInfo';
          messageObject.data = result;
          conn.send(JSON.stringify(messageObject));
        }
      });
    }
  });

  // Close handler
  ws.on('close', () => {
    gamesConnections.forEach((game, groupID) => {
      gamesConnections.set(groupID, {
        ...game,
        group: game.group.filter(conn => conn !== ws)});
    });
    console.log('Client disconnected');
  });
});

// Create HTTP server using Express app
const server = app.listen(8080, () => {
  console.log('Local IP Adress:', ip.address());
  console.log('Server started on port 8080');
});

// Upgrade HTTP server to WebSocket server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
