import React from 'react';
import './App.css';
import {SocketProvider} from './components/context/socket';
import {InfoProvider} from './components/context/info';
import Play from './components/Play';
import Wrong from './components/Wrong';
import Account from './components/Account';
import Leaderboard from './components/Leaderboard';
import CommunityQuestions from './components/community/CommunityQuestions';
import ChallengeFriend from './components/ChallengeFriend';

const App = (props) => {

  return ( 
    <div className="App">
      <InfoProvider>
        <div className="grid">
          <div className="title">
            quizmaster
          </div>
          <div className="play box">
            <SocketProvider>
              <Play />
              <br />
              <ChallengeFriend roomId={props.roomId} />
            </SocketProvider>
            <Wrong />
          </div>
          <div className="account box">
            <Account />
          </div>
          <div className="leaderboard box">
            <Leaderboard />
          </div>
          {/*<div className="questions box">
            <CommunityQuestions />
          </div>*/}
        </div>
      </InfoProvider>
    </div>
  );
}

export default App;