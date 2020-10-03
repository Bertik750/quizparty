import React, {useState, useContext} from 'react';
import { motion } from "framer-motion";
import './CommunityQuestions.css';
import { InfoContext } from '../context/info';
import QuestionForm from './QuestionForm';
import QuestionVote from './QuestionVote';

const CommunityQuestions = () => {

  const [info] = useContext(InfoContext);
  const [opened, setOpen] = useState(false);

  const calcLevel = () => {
    const y = Math.sqrt(info.totalScore / 1000)*Math.LN10;
    console.log(y);

    return y;
  }

  return (
    <motion.div className="communityQuesDiv box" animate={opened ? {height: "100%"} : {height: "25%"}}>
      <div className="boxTitle" style={{cursor: "pointer"}}  onClick={() => setOpen(!opened)}>
        <div style={{float: "right"}}></div>
        <div className="centerProfile">Community</div>
      </div>
      <p style={{textAlign: "center", margin: 10}}>
        Feel free to submit your own questions or vote for upcoming questions!
      </p>
      
      {(isNaN(info.totalScore) || calcLevel() < 10)?
        <p style={{width: "100%", textAlign: "center"}}><b>Please reach level 10 first</b></p>
      :
      <>
        <QuestionVote />
        <QuestionForm />
      </>
      }
      
    </motion.div>
  );
};

export default CommunityQuestions;