# LAN Family Feud
# Family Feud LAN Version 1.0

##### App Description
* Family Feud where one device is Game Screen and a second device as Host Screen.
* Game Screen contains questions.
* Host Screen can show answers to questions on Game Screen.

##### Technical Description
* Frontend: React.js
* Backend: Express.js
* Frontend & Backend comunicate on LAN network vis websockets.

##### How To Use 

```
# Clone the repository
git clone https://github.com/etc3333/familyfeud-websocket-version.git

# Navigate to the project directory
cd familyfeud-websocket-version

# Install dependencies for Frontend and Backend
cd frontend
npm install
cd backend
npm install

# start Frontend and Backend
cd frontend
npm start
cd backend
node server.js
```