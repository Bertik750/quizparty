import React, {useState, useContext, useEffect} from 'react';
import Cookie from 'js-cookie';
import '../../App.css';
import { InfoContext } from '../context/info';
import Ques from '../Ques';

const QuizChallenge = (props) => {

  const [info] = useContext(InfoContext);
  const [index, setIndex] = useState(0);
  const [questions, setQues] = useState(props.room.questions);
  const [random, setRandom] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t+1)
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const finishQuizChallenge = async () =>  {
    let participants = props.room.participants;
    participants.push({name: props.guestName, score: score, time: time})
    let header = new Headers();
    header.append("Content-Type", "application/json");
    const response = await fetch("http://localhost:8080/quizes/room/newscore/", 
    {
      method: 'POST',
      headers: header,
      redirect: 'follow',
      body: JSON.stringify({
        id: props.room._id,
        update: {participants: participants}
      })
    })
    if(response.status === 200) {
      props.setQuizState(false);
      props.setAlreadyPlayed(true);
      props.setScore2(score);
      if(!info.name) Cookie.set("guestName", {guestName: props.guestName, score: score, room_id: props.room._id,}, { expires: 7 });
      console.log('submited score');
    }
  }

  useEffect(() => {
    if(index === questions.length) {
      finishQuizChallenge();
    } else {
      setRandom(shuffle([questions[index].alt1, questions[index].alt2, questions[index].alt3, questions[index].answer]));
    }
  }, [index, questions]);

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return (
    <div>
      <p>Score: {score}/{questions.length}</p>
      <p>{Math.floor(time/60)}:{(time % 60) < 10 ? "0"+(time % 60) : time % 60}</p>
      {index < questions.length &&
        <Ques question={questions[index].question} 
        answ1={random[0]} 
        answ2={random[1]} 
        answ3={random[2]} 
        answ4={random[3]}
        setIndex={setIndex}
        correct={questions[index].answer}
        setScore={setScore}
      />
      }
    </div>
  );

}

export default QuizChallenge;
