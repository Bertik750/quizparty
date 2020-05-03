import React, {useContext, useState, useEffect} from "react";
import './Start.css';
import Ques from './Ques';
import Register from './account/Register';
import Login from './account/Login';
import { InfoContext } from './info';
import { SocketContext } from './socket';
import socketIOClient from "socket.io-client";

const Start = (props) => {

  const [socket, setSocket] = useContext(SocketContext);
  const [info, setInfo] = useContext(InfoContext);

  const [time, setTime] = useState("0:00");
  const [score, setScore] = useState(0);
  const [countdown, setCount] = useState(3);
  const [quizState, setQuiz] = useState(false);
  const [didLogin, setDidLogin] = useState(false);
  const [questions, setQues] = useState([]);
  const [nowCorrect, setNowCor] = useState();
  const [rank, setRank] = useState("");
  const [result, setResult] = useState("");
  const [index, setIndex] = useState(0);

  const [selSubjects, setSelSub] = useState([]);
  const [subjects, setSubjects] = useState(['TOK', 'English', 'Math', 'Geography', 'ESS', 'Physics', 'History', 'Economics', 'Global Politics']);
  const [selSubErr, setSelSubErr] = useState("");

  const startQuiz = () => {
    if(!quizState) {
      if(selSubjects.length === 6) {
        const subData = selSubjects.map(v => v.toLowerCase());
        if(!info._id) {
          info._id = "guest";
        }
        socket.emit('start', {id: info._id, subjects: subData});
        setQuiz(!quizState);
      } else {
        setSelSubErr("Please choose 6 subjects");
      }
    }
    let localLen = 0;
    let localIndex = 0;
    let localScore = 0;
    socket.on('ques', (data) => {
      setQues(data);
      localLen = data.length;
      //countdown
      let c = 2;
      const intv = setInterval(() => {
        setCount(c);
        if(c === 0) {clearInterval(intv)};
        c--;
      }, 1000);
    });
  
    socket.on('time', (data) => {
      let sec = data % 60;
      let min = Math.floor(data / 60);
      setTime(min+":"+sec);
    });
  
    socket.on('countdown', (data) => {
      setCount(data);
    });
  
    socket.on('correct', (data) => {
      setScore(data[1]);
      localScore = data[1];
      setNowCor(data[0]);
      setTimeout(() => {
        if(localIndex+1 < localLen) {
          setIndex(i => i+1);
          localIndex++;
        }
      }, 250);
    });

    socket.on('finquiz', (data) => {
      setQuiz('fin');
      setRank(data[0]);
      setResult(data[1]);

      if(data[1].indexOf("High") > -1) {
        setInfo(prevState => ({...prevState, highScore: localScore, rank: data[1], totalScore: data[2]}));
      } else {
        setInfo(prevState => ({...prevState, rank: data[1], totalScore: data[2]}));
      }
    });
  }

  const playAgain = async () => {
    await socket.disconnect();
    setQuiz(false);
    setCount(3);
    setScore(0);
    setIndex(0);
    setTime("");
    await setSocket(socketIOClient('http://10.0.1.9:8080'));
  }

  const add = (e) => {
    if(selSubjects.length +1 <= 6) {
      const val = e.target.getAttribute("value");
      setSelSub(oldArray => [...oldArray, val]);
      setSubjects(subjects.filter(item => item !== val));
    } else {
      setSelSubErr("Too much subjects!");
    }
  }
  const remove = (e) => {
    const val = e.target.getAttribute("value");
    setSelSub(selSubjects.filter(item => item !== val));
    setSubjects(oldArray => [...oldArray, val]);
  }

  useEffect(() => {
    if(info._id !== "guest" && quizState === 'fin' && didLogin === true) {
      setDidLogin(false);
      socket.emit('logedIn', info._id);
    }
  }, [info._id, quizState, socket, didLogin]);

  return (
    <div className="popQuiz">
      <h2 className="title" style={{fontSize: "1em", margin: 10}}>EpicQuiz</h2>
      <span className="x" onClick={props.connect}>X</span>
      {!quizState &&
        <div>
          <h4>How to play:</h4>
          <h4>Choose six subjects to recieve questions from:</h4>
          <div className="container">
            {
            selSubjects.map((el, i) =>
              <div key={i} value={el} onClick={e => remove(e)}>{el}</div>
              )
            }
          </div>
          <div className="container">
            {
              subjects.map((el, i) =>
              <div key={i} value={el} onClick={e => add(e)}>{el}</div>
              )
            }
          </div>
          {selSubErr}
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      }
      <p>{time}</p>
      <p>{index+1 + "/" +questions.length}</p>
      {countdown > 0 &&
        <p>{countdown}</p>
      }
      <p>{score}</p>
      {countdown < 1 && quizState === true && 
        <Ques question={questions[index].question} 
          answ1={questions[index].alt1} 
          answ2={questions[index].alt2} 
          answ3={questions[index].alt3} 
          answ4={questions[index].alt4}
          index={index}
          correct={nowCorrect}
        />
      }
      {quizState === 'fin' &&
        <div>
          <label>Today's Rank: </label>
          {
          info.name ? 
            <div>
              {result.indexOf("New") !== -1 ?
                <div>
                  <span>{rank}</span>
                  <p>{result}</p>
                  <p>New Total Score: {info.totalScore}</p>
                </div>
                :
                <div>
                  <span>{rank}</span>
                  <p>{result}</p>
                  <p>New Total Score: {info.totalScore}</p>
                </div>
              }
            </div>
            :
            <div>
              <p>Please sign up to submit score, see your rank and level up! (no personal info required!)</p>
              <Login setDidLogin={setDidLogin} start={true}/>
              <Register setDidLogin={setDidLogin} start={true}/>
            </div>
          }
          <button onClick={playAgain}>Play Again</button>
        </div>
      }
    </div>
  );
}

export default Start;