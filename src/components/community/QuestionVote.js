import React, {useEffect, useState} from 'react';

const QuestionVote = () => {

  const [loading, setLoading] = useState(true);
  const [ques, setQues] = useState({});
  const [rating, setRating] = useState("");

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
    <div>
      {
      rating ?
        <p>New Rating: {rating}%</p>
      :
      loading ? 
        <p>Loading...</p>
        :
        <div>
          <h2 style={{textAlign: "center"}}>{ques.question}</h2>
          <h5 style={{textAlign: "center", margin: 0}}>Category: {ques.category}</h5>
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