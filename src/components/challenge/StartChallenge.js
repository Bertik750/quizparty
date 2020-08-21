import React, {useState, useContext, useEffect} from 'react';
import Cookie from 'js-cookie';
import { motion } from "framer-motion";
import { List } from 'react-content-loader';
import '../../App.css';
import { InfoContext } from '../context/info';
import QuizChallenge from './QuizChallenge';
import Register from '../account/Register';
import Login from '../account/Login';

const StartChallenge = ({room}) => {

  const [info] = useContext(InfoContext);
  const [guestName, setGuestName] = useState("");
  const [quizState, setQuizState] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if(info.name && room) {
      const i = room.participants.map(function(e) { return e.name; }).indexOf(info.name);
      if(i !== -1) {
        setScore(room.participants[i].score);
        setAlreadyPlayed(true);
      }
      return;
    };
    const roomCookie = Cookie.get("guestName") ? JSON.parse(Cookie.get("guestName")) : null;
    if(roomCookie && room && roomCookie.room_id === room._id) {
      setAlreadyPlayed(true);
      setGuestName(roomCookie.guestName);
      setScore(roomCookie.score);
    }
  }, [room, info.name]);

  const startQuiz = () => {
    setQuizState(true);
  }

  return (
    <div>
      {room && !quizState &&
      <>
        <p>{room._id}</p>
        <p><b>{room.creator.name}</b> created this challenge!</p>
        {!alreadyPlayed && !info.name &&
          <>
            <p>Please enter a name or login/register</p>
            <label>Name: </label><input name="guestName" onChange={e => setGuestName(e.target.value)} />
            <Login />
            <Register />
          </>
        }
        {info.name &&
          <p>Logged in as: <b>{info.name}</b></p>
        }
        {alreadyPlayed &&
          <p>You scored <b>{score}</b> as <b>{guestName || info.name}</b>!</p>
        }
        
        {(guestName || info.name) && 
          !alreadyPlayed && 
          room.participants.map(function(e) { return e.name; }).indexOf(guestName) === -1 &&
          <button onClick={startQuiz}>Play</button>
        }

        <ul>
          <li>name | score | time</li>
          {room.participants.length > 0 &&
            room.participants.sort(function (x, y) { return y.score - x.score || x.time - y.time; }).map((el) => 
            <li key={el.name}>{(guestName || info.name) === el.name ? <b>{el.name}</b> : <>{el.name}</>}: {el.score} | {Math.floor(el.time / 60)}min {el.time % 60}sec</li>
            )
          }
        </ul>
        
      </>}
      {quizState &&
        <QuizChallenge room={room} setQuizState={setQuizState} setAlreadyPlayed={setAlreadyPlayed} setScore2={setScore} guestName={info.name || guestName}/>
      }
      {room === undefined &&
        <p>Error loading room :(</p>
      }
    </div>
  );

}

export default StartChallenge;
