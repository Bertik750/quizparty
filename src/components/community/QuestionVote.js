import React, {useEffect, useState} from 'react';
import useFitText from "use-fit-text";

const QuestionVote = () => {

  const [loading, setLoading] = useState(true);
  const [ques, setQues] = useState({});
  const [rating, setRating] = useState("");
  const { fontSize, ref } = useFitText({resolution: 10, maxFontSize: 300});

  const fetchData = async () => {
    try {
      const result = await fetch("http://localhost:8080/questions/unverified");
      const parse = await result.json();
      setLoading(false);
      setQues(parse.data.questions);
    }catch(err) {
      console.log(err);
    }
  }

  const vote = async (way) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          "_id":ques._id,
          "vote": way
        }
      ),
      redirect: 'follow'
    };
    try {
      const total = ques.like + ques.dislike +1;
      let rating;
      way ? (rating = (ques.like + 1) / total) : rating =(ques.like / total);
      setRating(Math.round(rating * 100));

      await fetch("http://localhost:8080/questions/vote", requestOptions);
      fetchData();
      void setTimeout(() => {
        setRating("");
      }, 2000);
    }catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="quizList">
      <div ref={ref} style={rating ? {display: "none"} : { fontSize, height: 40, width: "100%", textAlign: "center"}}>{ques.question}</div>
      {
      rating ?
        <p style={{textAlign: "center", width: "100%"}}>New Rating: {rating}%</p>
      :
      loading ? 
        <p>Loading...</p>
        :
        <div className="quesFeedback">
          <h5 style={{textAlign: "center", margin: 5}}>Category: {ques.category}</h5>
          <div className="boxRow">
            <p style={{backgroundColor: "lightGreen"}}>{ques.answer}</p>
            <p>{ques.alt1}</p>
            <p>{ques.alt2}</p>
            <p>{ques.alt3}</p>
          </div>
          <div className="boxRow" >
            <div className="like" style={{marginRight: 50}} onClick={() => vote(true)}>
              +
            </div>
            <div className="dislike" onClick={() => vote(false)}>
              -
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default QuestionVote;