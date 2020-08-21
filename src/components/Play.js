import React, {useState, useContext} from 'react';
import { motion } from "framer-motion";
import '../App.css';
import Start from './Start';
import { SocketContext } from './context/socket';
import socketIOClient from "socket.io-client";
import { InfoContext } from './context/info';

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


  const overlay = {
    open: { opacity: 1, zIndex: 2 },
    closed: { opacity: 0, zIndex: -1 },
  }

  return (
    <div style={{textAlign: "center"}}>
      <h2>Welcome</h2>
      <p>Compete with the world in quizes, while also studying for the IB!</p>
      <button className="playButton" onClick={connect}>PLAY!</button>
        <motion.div className="overlay" initial={false} animate={open ? "open" : "closed"} variants={overlay}>
          <Start connect={connect} open={open}/>
        </motion.div>
    </div>
  );
}

export default Play;