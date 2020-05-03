import React from 'react';
import './App.css';
import {SocketProvider} from './components/socket';
import {InfoProvider} from './components/info';
import Play from './components/Play';
import Account from './components/Account';
import Leaderboard from './components/Leaderboard';
import CommunityQuestions from './components/CommunityQuestions';

const App = () => {
  return (
    <div className="App">
      <InfoProvider>
        <div className="grid">
          <div className="title">
            EpicQuiz
          </div>
          <div className="play box">
            <SocketProvider>
              <Play />
            </SocketProvider>
          </div>
          <div className="leaderboard box">
            <Leaderboard />
          </div>
          <div className="questions box">
            <CommunityQuestions />
          </div>
          <div className="account box">
            <Account />
          </div>
        </div>
      </InfoProvider>
    </div>
  );
}

export default App;