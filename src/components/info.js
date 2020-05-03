import React, {useState, createContext} from 'react';

export const InfoContext = createContext();

export const InfoProvider = (props) => {
  const [info, setInfo] = useState({
    name: "",
    school: "",
    highScore: ""
  });

  return (
    <InfoContext.Provider value={[info, setInfo]}>
      {props.children}
    </InfoContext.Provider>
  )
}