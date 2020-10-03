import React, {useContext, useEffect, useState} from 'react';
import { InfoContext } from '../context/info';

const Profile = () => {

  const [info] = useContext(InfoContext);
  const [level, setLevel] = useState("");
  const [prog, setProgress] = useState(null);

  useEffect(() => {
    function calcLevel() {
      const y = Math.sqrt(info.totalScore / 1000)*Math.LN10;
      return y;
    }
    const calc = calcLevel();
    const lvl = Math.floor(calc);
    const progress = calc - lvl;
    setLevel(lvl);
    setProgress(progress);
  }, [info.totalScore])

  return (
    <div>
      <div className="profileHead">
        <svg width="11%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2">
            <image x="-5" y="0" width="200" href={require(`../../resources/level-icons/${Math.floor(level/10) * 10}.svg`)}/>
            <text textAnchor="middle" x="95" y="120" fill="#4b4b4b" fontSize="4.5em" fontWeight="600">{level}</text>  
          </svg>
        <h3 className="accountName">

          {info.fullName}
        </h3>
      </div>
      <div>
        <div className="levelProgressBox">
          <span style={{color: "rgb(108, 125, 182)", fontWeight: 600}}>{level}</span>
          <div className="progressbar">
            <div style={{width: prog*100+"%"}}></div>
          </div>
          <span style={{color: "rgb(110, 110, 110)", fontWeight: 600}}>{level+1}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;