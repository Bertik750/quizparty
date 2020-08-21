import React, {useState} from 'react';
import { useForm } from "react-hook-form";

const QuestionForm = () => {

  const [showQues, setQues] = useState(false);
  const showhideQues = () => {
    setQues(!showQues)
  }

  const { handleSubmit, register, errors } = useForm();
  const onSubmit = async (values, e) => {
    console.log(values);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      redirect: 'follow'
    };
    const response = await fetch('http://localhost:8080/questions/add', requestOptions);
    const data = await response.json();
    if(data.resolved === "success") {
      e.target.reset();
    }
    console.log(data);
  };

  return (
    <div>
      <button onClick={showhideQues}>{showQues ? "Hide Question" : "Show Question"}</button>
      {showQues &&
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Question:</label>
          <input
            name="question"
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._ %+-]+[?]$/i,
                message: "invalid question"
              }
            })}
          />
          {errors.question && errors.question.message}
          
          <label>Answer:</label>
          <input
            name="answer"
            ref={register({
              required: 'Required'
            })}
          />
          {errors.answer && errors.answer.message}
          
          <label>Alternatives:</label>
          <input
            name="alt1"
            ref={register}
          />
          <input
            name="alt2"
            ref={register}
          />
          <input
            name="alt3"
            ref={register}
          />
          
          <label>Category:</label>
          <select name="category" ref={register}>
            <option value="tok">TOK</option>
            <option value="english">English</option>
            <option value="math">Math</option>
            <option value="geography">geography</option>
            <option value="ess">ESS</option>
            <option value="physics">Physics</option>
            <option value="history">History</option>
            <option value="eco">Economics</option>
            <option value="glopo">Global Politics</option>
          </select>

          <label>Difficulity:</label>
          <select name="difficulity" ref={register}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
  
          <button type="submit">Submit</button>
        </form>
      }
    </div>
  );
}

export default QuestionForm;