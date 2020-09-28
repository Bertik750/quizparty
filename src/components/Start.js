import React, {useContext, useState, useEffect} from "react";
import { motion } from "framer-motion";
import './Start.css';
import Ques from './Ques';
import QuizHeader from './QuizHeader';
import Register from './account/Register';
import Login from './account/Login';
import { InfoContext } from './context/info';
import { SocketContext } from './context/socket';
import socketIOClient from "socket.io-client";
import Cookie from 'js-cookie';

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
  const [sending, setSending] = useState(false);
  const [rank, setRank] = useState("");
  const [result, setResult] = useState("");
  const [index, setIndex] = useState(0);

  const [selSubjects, setSelSub] = useState([]);
  const [subjects, setSubjects] = useState(['TOK', 'English', 'Math', 'Geography', 'ESS', 'Physics', 'History', 'Economics', 'Global Politics']);
  const [selSubErr, setSelSubErr] = useState("");

  const startQuiz = () => {
    if(!quizState) {
      if(selSubjects.length > 2) {
        const subData = selSubjects.map(v => v.toLowerCase());
        if(!info._id) {
          info._id = "guest";
        }
        socket.emit('start', {id: info._id, subjects: subData});
        setCount(3);
        setQuiz(!quizState);
      } else {
        setSelSubErr("Please choose at least 3 subjects");
      }
    }
    let localLen = 0;
    let localIndex = 0;
    let localScore = 0;
    let localQues = [];
    socket.on('ques', (data) => {
      setQues(data);
      localQues = data;
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
      let sec = (data % 60) < 10 ? "0"+(data % 60) : data % 60;
      let min = Math.floor(data / 60);
      setTime(min+":"+sec);
    });
  
    socket.on('correct', (data) => {
      setSending(false);
      setScore(data[1]);
      localScore = data[1];
      setNowCor(data[0]);
      if(!data[0] && info.name) {
        setInfo(prevState => ({...prevState, questionsWrong: [...prevState.questionsWrong, localQues[localIndex].id]}));
      }
      setTimeout(() => {
        if(localIndex+1 < localLen) {
          setIndex(i => i+1);
          localIndex++;
        }
      }, 300);
    });

    socket.on('finquiz', (data) => {
      setTimeout(() => {
        setQuiz('fin');
        setRank(data[0]);
        setResult(data[1]);
      }, 750);

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
  const xOut = async () => {
    props.connect();
    setQuiz(false);
    setScore(0);
    setIndex(0);
    setTime("");
  }

  const add = (e) => {
    const val = e.target.getAttribute("value");
    if(selSubjects.indexOf(val) > -1) {
      setSelSub(selSubjects.filter(item => item !== val));
      Cookie.set("subjectsCombination", JSON.stringify(selSubjects.filter(item => item !== val)));
      setSelSubErr("");
    } else {
      if(selSubjects.length +1 <= 6) {
        setSelSub(oldArray => [...oldArray, val]);
        Cookie.set("subjectsCombination", JSON.stringify([...selSubjects, val]));
        setSelSubErr("");
      } else {
        setSelSubErr("Too much subjects!");
      }
    }
  }
  useEffect(() => {
    if(selSubjects.length === 0) {
      const subjectsFromCookie = Cookie.get("subjectsCombination") ? JSON.parse(Cookie.get("subjectsCombination")) : null;
      if(subjectsFromCookie === null) return;
      setSelSub(subjectsFromCookie);
    }
  }, [selSubjects])

  useEffect(() => {
    if(info._id !== "guest" && quizState === 'fin' && didLogin === true) {
      setDidLogin(false);
      socket.emit('logedIn', info._id);
    }
  }, [info._id, quizState, socket, didLogin]);

  const variants = {
    open: { scale: 1, display: "block" },
    closed: { scale: 0, display: "" },
  }

  return (
    <motion.div className="popQuiz" initial={false} animate={props.open ? "open" : "closed"} variants={variants}>
      <span className="x" onClick={xOut}>X</span>
      {!quizState &&
        <div>
          <h3>The Quiz</h3>
          <div className="tutorial">
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus vitae aliquet nec ullamcorper sit amet. Nulla facilisi nullam vehicula ipsum a arcu cursus vitae.
            </p>
          </div>
          <br />
          <div className="choose globe">
            <div className="quizList subjects">
              {
                subjects.map((el, i) =>
                <div 
                  key={i} 
                  value={el} 
                  onClick={e => add(e)} className={selSubjects.indexOf(el) > -1 ? "selected" : null}>
                {el}
                </div>
                )
              }
            </div>
          </div>
          <button className="startQuizButton" onClick={startQuiz}>Start Quiz</button>
          <p>{selSubErr}</p>
        </div>
      }
      {countdown > 0 && quizState === true &&
        <motion.p 
          className="countDown"
          key={countdown}
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 10
          }}
        >{countdown}</motion.p>
      }
      {countdown < 1 && quizState === true && 
        <>
          <QuizHeader 
            time={time}
            score={score}
            index={index}
            questions={questions}
          />
          <Ques
            answ1={questions[index].alt1} 
            answ2={questions[index].alt2} 
            answ3={questions[index].alt3} 
            answ4={questions[index].alt4}
            category={questions[index].category}
            index={index}
            correct={nowCorrect}
            sending={sending}
            setSending={setSending}
          />
        </>
      }

      {quizState === 'fin' &&
        <div className="fin">
          <br />
          {score > 0 ?
            <h2>Great Job!</h2>
            :
            <h3>Try Again!</h3>
          }
          <br />
          <motion.div className="finalScore"
            initial={{scale: 0, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
          >
            <span>YOUR SCORE:</span>
            <p className="bigScore">{score}</p>
          </motion.div>
          <br />
          <p className="todaysRank">Today's Rank: 
            {info.name ? <motion.span
              initial={{opacity: 0}}
              animate={{opacity: 1}}
            > {rank}</motion.span> : " :O"}
          </p>
          {
          info.name ? 
            <div>
              {result.indexOf("New") !== -1 ?
                <div>
                  <p className="highScoreResult">{result}</p>
                  <p className="newTotalScore">New XP count: <b>{info.totalScore}</b></p>
                </div>
                :
                <div>
                  <p className="highScoreResult">{result}</p>
                  <p className="newTotalScore">New XP count: <b>{info.totalScore}</b></p>
                </div>
              }
            </div>
            :
            <div className="loginOrRegisterContainer">
              <p>Sign up to save score, see your rank and level up! (not even email required)</p>
              <div className="loginOrRegister">
                <Login setDidLogin={setDidLogin} start={true} style={{display: "inline"}}/>
                <Register setDidLogin={setDidLogin} start={true} style={{display: "inline"}}/>
              </div>
            </div>
          }
          <button className="playButton" onClick={playAgain}>Play Again!</button>

        </div>
      }
    </motion.div>
  );
}

export default Start;