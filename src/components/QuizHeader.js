import React from "react";
import { motion } from "framer-motion";
import useFitText from "use-fit-text";
import MathJax from "@innodoc/react-mathjax-node";
import './Start.css'

const QuizHeader = React.memo(({index, questions, time, score}) => {

  const { fontSize, ref } = useFitText({resolution: 10, maxFontSize: 200});
  
  return(
    <div className="quizHeader">
      <div className="quizProgress">
        <span>{`Question:  ${index+1} / ${questions.length}`}</span>
      </div>
      <motion.div className="quizQuestion" 
        ref={ref} style={{ fontSize, height: 80, width: "100%"}}
        key={index}
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
      >
        {questions[index].category === "math" ?
          <MathJax.Provider>
            <div style={{marginTop: 10}}>
              <MathJax.MathJaxNode texCode={questions[index].question} />
            </div>
          </MathJax.Provider>
        :
          <>{questions[index].question}</>
        }
      </motion.div>
      <div className="timeScore">
        <motion.span className="time" 
          key={time} 
          initial={{opacity: 0.5,}} 
          animate={{opacity: 1}}
        >
          {time}
        </motion.span>
        <hr/>
        <motion.span className="score"
          key={score}
          initial={{opacity: 0.2, color: "rgb(10, 10, 10)"}}
          animate={{opacity: 1, color: ["rgb(10, 230, 10)", "rgb(10, 10, 10)"]}}
          transition={{ duration: 1 }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  )
});

export default QuizHeader;