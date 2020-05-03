import React, {useState, createContext} from 'react';

export const SocketContext = createContext();

export const SocketProvider = (props) => {
  const [socket, setSocket] = useState();
  return (
    <SocketContext.Provider value={[socket, setSocket]}>
      {props.children}
    </SocketContext.Provider>
  )
}