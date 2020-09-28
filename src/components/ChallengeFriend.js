import React, {useState, useContext, useEffect} from 'react';
import { motion } from "framer-motion";
import { List } from 'react-content-loader';
import '../App.css';
import Cookie from 'js-cookie';
import StartChallenge from './challenge/StartChallenge';
import { InfoContext, InfoProvider } from './context/info';
import { navigate } from "hookrouter";

const ChallengeFriend = ({roomId}) => {

  const [info] = useContext(InfoContext);
  const [quizes, setQuizes] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [create, setCreate] = useState(false);
  const [room, setRoom] = useState(null);
  const [joinRoomId, setJoinRoomId] = useState('');

  const openAndLoad = async () => {
    setOpen(true);
    try {
      const response = await fetch("http://localhost:8080/quizes/", 
      {
        method: 'GET',
        redirect: 'follow'
      })
      if(response.status === 200) {
        setLoading(false);
        const parse = await response.json();
        setQuizes(parse)
      }
    } catch (error) {
      console.error(error);
    }
  }

  const createRoom = async () => {
    setLoading(true);
    const tokenos = Cookie.get("token") ? Cookie.get("token") : null;
    try {
      let Header = new Headers();
      Header.append("token", tokenos);
      const response = await fetch("http://localhost:8080/quizes/create/" + selected, 
      {
        method: 'POST',
        headers: Header,
        redirect: 'follow'
      })
      if(response.status === 200) {
        setLoading(false);
        const parse = await response.json();
        setRoom(parse);
        setCreate(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getRoom = async (id) => {
    const tokenos = Cookie.get("token") ? Cookie.get("token") : null;
    try {
      let Header = new Headers();
      Header.append("token", tokenos);
      const response = await fetch("http://localhost:8080/quizes/room/" + id, 
      {
        method: 'GET',
        headers: Header,
        redirect: 'follow'
      })
      if(response.status === 200) {
        setLoading(false);
        const parse = await response.json();
        setRoom(parse);
        //console.log(parse);
      } else {
        setRoom(undefined);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setRoom(undefined);
      setLoading(false);
    }
  }

  useEffect(() => {
    if(roomId) {
      setOpen(true);
      setCreate(true);
      getRoom(roomId);
    }
  }, [roomId])

  const join = () => { //needs error handling!
    if(!joinRoomId) return;
    setLoading(true);
    getRoom(joinRoomId);
    setCreate(true);
  }

  const select = (el) => {
    if(selected === el.name) {
      setSelected(null)
    } else {
      setSelected(el.name);
    }
  }

  const close = () => {
    setOpen(false);
    setSelected(null);
    setCreate(false);
    setRoom(null);
    navigate('/');
  }

  const variants = {
    open: { scale: 1, display: "block" },
    closed: { scale: 0, display: "" },
  }
  const overlay = {
    open: { opacity: 1, zIndex: 2 },
    closed: { opacity: 0, zIndex: -1 },
  }

  return (
    <div style={{textAlign: "center"}}>
      <button className="playButton" style={{fontSize: "0.8em"}} onClick={openAndLoad}>Challenge your friend!</button>
        <motion.div className="overlay" initial={false} animate={open ? "open" : "closed"} variants={overlay}>
          <motion.div className="popQuiz" initial={false} animate={open ? "open" : "closed"} variants={variants}>
            <span className="x" onClick={close}>X</span>
            {!create &&
              <div>
                <h3>Challenge a friend</h3>
                <div style={{height: "2em"}}>
                  <input 
                    placeholder="To join a room paste the room code here" 
                    className="joinRoomId logRegInput" 
                    name="joinRoomId" 
                    onChange={e => setJoinRoomId(e.target.value)} />
                  <button className="joinRoomButton" onClick={join}>Join</button>
                </div>
                <h4>Pick a quiz to create a room and compete with friends!</h4>
                  <div className="quizList" >
                  {
                    quizes.map((el) => 
                    <div key={el._id} onClick={() => select(el)} className={selected === el.name ? "selected quizChooseCard" : "quizChooseCard"}>
                      <div className="quizCardTitle">{el.name}</div>
                      <div className="imgWrapper">
                        <img className="quizImg" src={el.imageURL} alt={el.name}/>
                      </div>
                      <p className="quizDesc"><i>{el.description}</i></p>
                    </div>
                    )
                  }
                </div>
                <div>
                  {selected &&
                    (info.name ? 
                      <button className="createRoomButton" onClick={createRoom}>Create</button>
                    :
                      <div>
                        <h5>Please Register to create a challenge</h5>
                        <h6>(To join a room an account is not needed)</h6>
                      </div>)
                  }
                </div>
              </div>
            }
            {create &&
              <StartChallenge 
                room={room}
              />
            }
            {loading &&
              <List style={{margin: 20}}/>
            }
            
          </motion.div>
        </motion.div>
    </div>
  );
}

export default ChallengeFriend;