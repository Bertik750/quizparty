import React, {useState, useContext, useEffect} from 'react';
import '../App.css';
import Start from './Start';
import { SocketContext } from './socket';
import socketIOClient from "socket.io-client";
import { InfoContext } from './info';

const Play = () => {

  const [socket, setSocket] = useContext(SocketContext);
  const [info] = useContext(InfoContext);
  const [open, setOpen] = useState(false);

  const connect = async () => {
    //if(info.name !== "") {
      if(open) {
        await socket.disconnect();
        setOpen(!open);
      } else {
        await setSocket(socketIOClient('http://10.0.1.9:8080'));
        setOpen(!open);
      }
    //}
  }

  /*useEffect(() => {
    if(info.name !== "") {
      setNameAlert(false);
    }
  }, [info])*/

  return (
    <div style={{textAlign: "center"}}>
      <h2>Welcome</h2>
      <p>Compete with the world in quizes, while also studying for the IB!</p>
      <button className="playButton" onClick={connect}>Play!</button>
      {open &&
        <div className="overlay">
          <Start connect={connect}/>
        </div>
      }
      <h3>About</h3>
      <p>hi</p>
    </div>
  );
}

export default Play;