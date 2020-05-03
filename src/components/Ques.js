import React, {useContext, useState, useEffect, useCallback} from "react";
import './Start.css'
import { SocketContext } from './socket';

const Ques = (props) => {

  const [socket] = useContext(SocketContext);
  const [selected, setSelected] = useState(false);

  const submitAnswer = (answ, id) => {
    if(!selected) {
      socket.emit('answ', [props.index, answ]);
      setSelected(id);
      console.log(id);
      console.log(answ);
    }
  };

  const Qbox = ({answ, id}) => {
    return (
      <div 
        onClick={() => submitAnswer(answ, id)} 
        className={`qbox ${selected === id ? props.correct ? 'correct' : 'not' : 'none'}`}
        >
        <h3>{answ}</h3>
      </div>
    )
  }

  useEffect(() => {
    setSelected(false);
  }, [props.question]);

  const downHandler = useCallback(({key}) => {
    if ([1, 2, 3, 4].indexOf(Number(key)) > -1) {
      const val = "answ" + key;
      submitAnswer(props[val], Number(key));
    }
  }, [props]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [downHandler]);

  return (
    <div className="ques">
      <h1 className="question">{props.question}</h1>
      <Qbox id={1} answ={props.answ1}/>
      <Qbox id={2} answ={props.answ2}/>
      <Qbox id={3} answ={props.answ3}/>
      <Qbox id={4} answ={props.answ4}/>
    </div>
  )
}

export default Ques;