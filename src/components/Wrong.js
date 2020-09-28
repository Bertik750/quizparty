import React, {useState, useContext} from 'react';
import { motion } from "framer-motion";
import { List } from 'react-content-loader';
import '../App.css';
import Cookie from 'js-cookie';
import { InfoContext } from './context/info';

const Wrong = () => {

  const [info, setInfo] = useContext(InfoContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ques, setQues] = useState(null);
  const [message, setMessage] = useState("");
  const [clicked, setClicked] = useState(null);
  const [nowCorrect, setNowCorrect] = useState(null);
  const [randomArr, setRandomArr] = useState(null);

  const tokenos = Cookie.get("token") ? Cookie.get("token") : null;

  const openQuestions = async () => {
    setOpen(true);
    console.log(info);
    if(!info.name) {
      setLoading(false);
      setMessage("Please register to use this");
      return
    } else if(info.questionsWrong && info.questionsWrong.length > 0) {
      try {
        let Header = new Headers();
        Header.append("Content-Type", "application/json");
        Header.append("token", tokenos);
        const response = await fetch("http://localhost:8080/questions/wrong", 
        {
          method: 'POST',
          headers: Header,
          body: JSON.stringify({"quesIds": info.questionsWrong}),
          redirect: 'follow'
        })
        if(response.status === 200) {
          setLoading(false);
          const parse = await response.json();
          let arr = [];
          for (let i=0; i < parse.data.questions.length; i++) {
            const arrGen = Array.from({length: 4}, () => Math.floor(Math.random() * 100));
            arr.push(arrGen);
          }
          setRandomArr(arr);
          setQues(parse.data.questions)
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setLoading(false);
      setMessage("Nothing to review :)")
    }
  }

  const correct = async (id, i) => {
    setNowCorrect(i);
    setTimeout(() => {
      setNowCorrect(null);
      setQues(ques.filter((e)=>(e._id !== id)));
    }, 1000);

    setInfo(prevState => ({...prevState, questionsWrong: info.questionsWrong.filter(e => (e !== id))}));
    try {
      let Header = new Headers();
      Header.append("Content-Type", "application/json");
      Header.append("token", tokenos);
      await fetch(`http://localhost:8080/questions/remove/${id}`, 
      {
        method: 'DELETE',
        headers: Header,
        redirect: 'follow'
      })
    } catch (error) {
      console.error(error);
    }
  }

  const wrong = (i) => {
    setClicked(i);
    setTimeout(() => {
      setClicked(null);
    }, 400)
  }

  const close = () => {
    setOpen(false);
  }

  const variants = {
    open: { scale: 1, display: "block" },
    closed: { scale: 0, display: "" },
  }
  const shake = {
    shake: {
      rotate: [2, -3, 2, -1],
      boxShadow: "5px 5px 8px rgba(255, 0, 0, 0.5)",
      transition: {
        duration: 0.4
      }
    },
    default: {
      rotate: 0,
      opacity: 1,
      boxShadow: "10px 10px 10px rgba(0, 0, 0, 0)",
    },
    fly: {
      opacity: 0,
      boxShadow: "5px 5px 8px rgba(0, 255, 0, 0.8)",
      transition: {
        duration: 1
      }
    }
  }; 

  return (
    <div style={{textAlign: "center"}}>
      <button className="playButton" style={{fontSize: "0.8em", marginTop: 10}} onClick={openQuestions} >Review wrong answers!</button>
        
        <motion.div className="overlay" initial={false} animate={open ? "open" : "closed"} variants={variants}>
          <div className="popQuiz" style={{height: "auto", paddingBottom: "1em"}}>
            <span className="x" onClick={close}>X</span>
            <h3>Wrong Answers:</h3>
            <div>
              {(ques && Object.keys(info).length !== 0) ?
                ques.map((el, i) => 
                  <motion.div key={i} className="wrongQuestionBox" animate={clicked===i ? "shake" : nowCorrect===i ? "fly" : "default"} variants={shake} >
                    <div className="wrongQues">{el.question}</div>
                    <div className="wrongAnswerBox">
                      <div className="wrongAnswer" style={{order: randomArr[i][0]}} 
                        onClick={() => correct(el._id, i)}>{el.answer}</div>
                      <div className="wrongAnswer" style={{order: randomArr[i][1]}}
                        onClick={() => wrong(i)}>{el.alt1}</div>
                      <div className="wrongAnswer" style={{order: randomArr[i][2]}}
                        onClick={() => wrong(i)}>{el.alt2}</div>
                      <div className="wrongAnswer" style={{order: randomArr[i][3]}}
                        onClick={() => wrong(i)}>{el.alt3}</div>
                    </div>
                  </motion.div>
                )
                :
                <div>{message}</div>
              }
              {loading  && 
                <List style={{margin: 20}}/>
              }
            </div>
          </div>
        </motion.div>
      
    </div>
  );
}

export default Wrong;