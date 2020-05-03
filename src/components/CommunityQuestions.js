import React from 'react';
import './CommunityQuestions.css';
import QuestionForm from './QuestionForm';
import QuestionVote from './QuestionVote';

const CommunityQuestions = () => {

  return (
    <div className="communityQuesDiv">
      <QuestionForm />
      <QuestionVote />
    </div>
  );
};

export default CommunityQuestions;