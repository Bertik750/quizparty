import React, {useContext, useState, useEffect, useCallback} from "react";
import { motion } from "framer-motion";
import useFitText from 'use-fit-text';
import MathJax from 'react-mathjax2';
import './Start.css';
import { SocketContext } from './context/socket';


const Ques = React.memo((props) => {

  const [socket] = useContext(SocketContext);
  const [selected, setSelected] = useState(false);
  const { fontSize, ref } = useFitText({resolution: 10, maxFontSize: 150, minFontSize: 40});

  const submitAnswer = useCallback((answ, id) => {
    if(selected) return;
    setSelected(id);
    if(props.setIndex) { //check if ques is used in friend challenge
      if(props.correct === answ) {
        props.setScore(s => s+1);
      }
      setTimeout(() => {
        props.setIndex(i => i+1);
      }, 250)
    } else { // global challenge
      props.setSending(true);
      socket.emit('answ', [props.index, answ]);
    }
  }, [props, selected]);

  const Qbox = ({answ, id}) => {
    return(
      <div 
        onClick={() => submitAnswer(answ, id)} 
        className={`qbox ${selected === id ? 
            (props.correct === true || props.correct === answ) ? 'correct' : 'not' 
            : 'none'}
         ${(selected === id && props.sending) ? 'sending' : ' '}`}
        >
        <motion.p ref={ref} style={{ fontSize, height: 150, width: "100%" }}
          key={props.answ1}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
        >
          {props.category === "math" ?
            <MathJax.Context input='ascii'>
                <MathJax.Node>{answ}</MathJax.Node>
            </MathJax.Context>
          :
            <>{answ}</>
          }
          
        </motion.p>
        {props.sending && selected === id &&
          <p style={{position: "absolute", textAlign: "center", width:"50%"}}>Sending...</p>
        }
      </div>
    )
  };

  useEffect(() => {
    setSelected(false);
  }, [props.question, props.index]);

  const downHandler = useCallback(({key}) => {
    if ([1, 2, 3, 4].indexOf(Number(key)) > -1) {
      const val = "answ" + key;
      submitAnswer(props[val], Number(key));
    }
  }, [props, submitAnswer]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [downHandler]);

  return (
    <div className="ques">
      <Qbox id={1} answ={props.answ1} />
      <Qbox id={2} answ={props.answ2} />
      <Qbox id={3} answ={props.answ3} />
      <Qbox id={4} answ={props.answ4} />
    </div>
  )
});

export default Ques;