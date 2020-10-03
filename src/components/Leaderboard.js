import React, {useContext, useState, useEffect, useCallback} from "react";
import { motion } from "framer-motion";
import { BulletList } from 'react-content-loader';
import './Leaderboard.css';
import { InfoContext } from './context/info';

const Leaderboard = () => {

  const [info] = useContext(InfoContext);
  const [top, setTop] = useState("");
  const [loaded, setLoaded] = useState(10);
  const [rank, setRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actI, setActIndex] = useState("week");
  const [opened, setOpened] = useState();

  const set = (text) => {
    fetchData(text);
    setActIndex(text);
    setTop([]);
    setLoaded(10);
    setLoading(true);
  }

  const fetchData = useCallback(async (timeFrame) => {
    const result = await fetch("http://10.0.1.9:8080/leaderboard", {
      headers: {
        'highscore': info[timeFrame + "highScore"],
        'timeframe': timeFrame,
        'totalScore': info.totalScore
      }
    });
    const parse = await result.json();
    setLoading(false);
    setTop(parse.data.accounts);
    setRank(parse.data.rank);
  }, [info.highScore]);

  const loadMore = async () => {
    setLoading(true);
    const result = await fetch("http://10.0.1.9:8080/leaderboard/more", {
      headers: {
        'timeframe': actI,
        'skip': loaded
      }
    });
    const parse = await result.json();
    const newArr = top.concat(parse.data.accounts);
    setTop(newArr);
    setLoaded(prevLoad => prevLoad+10);
    setLoading(false);
  }

  const handleScroll = (e) => {
    const target = e.target;
    if(target.scrollHeight - target.scrollTop === target.clientHeight && loading === false) {
      loadMore();
    }
  }

  useEffect(() => {
    fetchData(actI);
  }, [info.highScore, actI, fetchData]);

  const scale = {
    open: {
      height: 310,
      fill: "rgb(198, 219, 241)"
    },
    closed: {
      height: 115,
      fill: "rgb(212, 214, 216)"
    }
  };
  const scale2 = {
    open: {
      height: 300,
    },
    closed: {
      height: 105
    }
  };
  const appear = {
    open: {
      opacity: 1,
      transition: {
        delay: 0.1
      }
    },
    closed: {
      opacity: 0
    }
  }; 

  const calcLevel = (score) => {
    const y = Math.sqrt(score / 1000)*Math.LN10;
    return Math.floor(y);
  }

  return (
    <div>
      <div className="boxTitle"><span>Leaderboard</span></div>
      <div className="timeRank">
        <span onClick={() => set("today")} className={actI === "today" ? "active" : ""}>today</span>
        <span onClick={() => set("week")} className={actI === "week" ? "active" : ""}>week</span>
        <span onClick={() => set("month")} className={actI === "month" ? "active" : ""}>month</span>
        <span onClick={() => set("")} className={actI === "" ? "active" : ""}>Level</span>
      </div>
      <ul className="board" onScroll={handleScroll}>
        {top && 
          top.map((el, i) => 
            <motion.li key={i} animate={opened===i ? {height: 100} : {height: 45}} >
              <div className="rank" onClick={() => opened===i ? setOpened(null) : setOpened(i)}>
                <motion.svg width="85%" animate={opened===i ? "open" : "closed"} viewBox="0 0 950 400" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2">
                
                  <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="linearRGB">
                    <feDropShadow stdDeviation="6 5" in="SourceGraphic" dx="-1" dy="5" floodColor="#aaaaaa" floodOpacity="1" x="0%" y="0%" width="100%" height="100%" result="dropShadow1"/>
                  </filter>

                  <rect x="0" y="250" width="1" height="1" fill="#fff"/>
                  <motion.circle cx="85" cy="75" fill="rgb(212, 214, 216)" 
                    animate={opened===i ? {fill: "rgb(198, 219, 241)"} : {fill: "rgb(212, 214, 216)"}} 
                    r="75" filter="url(#filter)"/>
                  <motion.rect x="70" y="16" width="735" height="115" rx="30" fill="rgb(212, 214, 216)"
                    filter="url(#filter)"
                    variants={scale} 
                  />
                  {el.country && 
                    <image x="840" y="0" width="100" transform="rotate(50, 840, 40)" filter="url(#filter)"
                      href={require(`../resources/flags/cz.svg`)}/>
                  } 
                  <rect x="805" y="80" width="10" height="100" fill="grey" transform="rotate(-128, 800, 80)" /> 
                  <circle cx="85" cy="75" fill="#fff" r="71.3" />
                  <motion.rect x="75" y="22" width="725" height="105" rx="30" fill="#fff" 
                    variants={scale2} 
                  />
                  <text textAnchor="middle" x="83" y="75" fontWeight="600" fontSize="4.5em" dy="0.35em">{i+1}</text>
                  <motion.image x="130" y="20" width="110" href={require(`../resources/level-icons/${Math.floor(calcLevel(el.totalScore)/10) * 10}.svg`)}/>
                  <text textAnchor="middle" x="186" y="87" fill="#4b4b4b" fontSize="2.25em" fontWeight="600">{calcLevel(el.totalScore)}</text>
                  <text x="230" y="75" fontSize="3em" fontWeight="400" dy="0.35em">{el.fullName}</text>
                  <text textAnchor="end" x="755" y="75" fontWeight="600" fontSize="3em" dy="0.35em">{el.highScore}</text>
                  <motion.rect x="155" y="130" width="275" height="5" rx="1" fill="rgb(225, 225, 225)" 
                    initial={{opacity: 0}} transition={{ ease: "easeOut", duration: 0.15 }} variants={appear}
                  />
                  <motion.text initial={{opacity: 0}} transition={{ ease: "easeOut", duration: 0.15 }} variants={appear}
                    textAnchor="start" x="155" y="155" fontWeight="600" fontSize="1.7em" fill="rgb(205, 205, 205)" dy="0.35em">SUBJECTS
                  </motion.text>
                  {el.subjects &&
                    <motion.foreignObject initial={{opacity: 0}} transition={{ ease: "easeOut", duration: 0.1 }} variants={appear} 
                    x="155" y="190" width="150" height="110">
                    {el.subjects.map((subject, i) =>
                      i < 3 &&
                      <div key={subject} style={{fontSize: 20, fontWeight: 600, color: "rgb(110, 110, 110)"}}>{subject.capitalize()}</div>
                    )}
                  </motion.foreignObject>
                  }
                  {el.subjects.length > 3 &&
                    <motion.foreignObject initial={{opacity: 0}} transition={{ ease: "easeOut", duration: 0.1 }} variants={appear} 
                    x="325" y="190" width="115" height="110">
                    {el.subjects.map((subject, i) =>
                      i > 2 &&
                      <div key={subject} style={{fontSize: 20, fontWeight: 600, color: "rgb(110, 110, 110)"}}>{subject.capitalize()}</div>
                    )}
                  </motion.foreignObject>
                  }
                  
                  <motion.rect x="505" y="130" width="250" height="5" rx="1" fill="rgb(225, 225, 225)" 
                    initial={{opacity: 0}} transition={{ ease: "easeOut", duration: 0.15 }} variants={appear}
                  />
                  <motion.text initial={{opacity: 0}} transition={{ ease: "easeOut", duration: 0.15 }} variants={appear}
                    textAnchor="start" x="505" y="155" fontWeight="600" fontSize="1.7em" fill="rgb(205, 205, 205)" dy="0.35em">SCHOOL
                  </motion.text>
                  <motion.rect initial={{opacity: 0}} transition={{ ease: "easeOut", duration: 0.15 }} variants={appear}
                    x="505" y="185" width="250" height="95" rx="15" fill="rgb(247, 250, 255)" stroke="rgb(225, 227, 237)" strokeWidth="4">
                  </motion.rect>
                  <motion.foreignObject initial={{opacity: 0}} transition={{ ease: "easeOut", duration: 0.1 }} variants={appear} 
                    x="515" y="190" width="235" height="85">
                    <div style={{fontSize: 25, fontWeight: 600, color: "rgb(110, 110, 110)"}}>{el.school}</div>
                  </motion.foreignObject>
                </motion.svg>
              </div>
            </motion.li>
          )
        }
        {loading &&
         <BulletList style={{margin: 20}}/>
        }
        <li>
          <div className="rank">
            <button className="loadMore" onClick={loadMore}>Load More</button>
          </div>
        </li>
      </ul>
      <div>
        {rank > 10 && info[actI+"highScore"] &&
          <div className="rank personal">
            <svg className="personalSvg" width="85%" viewBox="0 0 930 400" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2">
              <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="linearRGB">
                <feDropShadow stdDeviation="6 5" in="SourceGraphic" dx="-1" dy="5" floodColor="#aaaaaa" floodOpacity="1" x="0%" y="0%" width="100%" height="100%" result="dropShadow1"/>
              </filter>
              <rect x="0" y="250" width="10" height="10" fill="#fff"/> 
              <circle cx="85" cy="75" fill="rgb(212, 214, 216)" 
                r="75" filter="url(#filter)"/>
              <rect x="70" y="16" width="735" height="115" rx="30" fill="rgb(212, 214, 216)"
                filter="url(#filter)"
              />
              {info.country && 
                <image x="840" y="0" width="100" transform="rotate(50, 840, 40)" filter="url(#filter)"
                  href={require(`../resources/flags/${info.country.toLowerCase()}.svg`)}/>
              }
              <rect x="805" y="80" width="10" height="100" fill="grey" transform="rotate(-128, 800, 80)" /> 
              <circle cx="85" cy="75" fill="#fff" r="71.3" />
              <rect x="75" y="22" width="725" height="105" rx="30" fill="#fff" />
              <text textAnchor="middle" x="83" y="75" fontWeight="600" color="#aaa" fontSize="4.5em" dy="0.35em">{rank}</text>
              <text x="155" y="75" color="#aaa" fontSize="3em" dy="0.35em">{info.fullName}</text>
              <text textAnchor="end" x="755" y="75" fontWeight="600" fontSize="3em" dy="0.35em">{info[actI + "highScore"]}</text>
            </svg>
          </div>
        }
      </div>

    </div>
  )
}

export default Leaderboard;

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}