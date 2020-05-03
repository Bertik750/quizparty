import React, {useContext, useState, useEffect, useCallback} from "react";
import './Leaderboard.css'
import { InfoContext } from './info';

const Leaderboard = () => {

  const [info] = useContext(InfoContext);
  const [top10, setTop] = useState("");
  const [rank, setRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actI, setActIndex] = useState("week");

  const set = (text) => {
    setActIndex(text);
    setTop([]);
    setLoading(true);
    fetchData(text);
  }

  const fetchData = useCallback(async (timeFrame) => {
    const result = await fetch("http://localhost:8080/leaderboard", {
      headers: {
        'highscore': info.highScore,
        'timeframe': timeFrame
      }
    });
    const parse = await result.json();
    setLoading(false);
    setTop(parse.data.accounts);
    setRank(parse.data.rank);
  }, [info.highScore]);

  useEffect(() => {
    fetchData(actI);
  }, [info.highScore, actI, fetchData]);

  return (
    <div>
      <h2>
        <svg height="13pt" viewBox="0 0 512.00001 512" width="13pt" xmlns="http://www.w3.org/2000/svg"><path d="m497 36.953125h-65.703125c.238281-7.277344.371094-14.597656.371094-21.953125 0-8.285156-6.71875-15-15-15h-321.332031c-8.285157 0-15 6.714844-15 15 0 7.355469.128906 14.675781.367187 21.953125h-65.703125c-8.285156 0-15 6.714844-15 15 0 67.210937 17.566406 130.621094 49.460938 178.554687 31.527343 47.386719 73.523437 74.566407 118.886718 77.210938 10.285156 11.191406 21.160156 20.316406 32.484375 27.277344v66.667968h-25.164062c-30.421875 0-55.167969 24.75-55.167969 55.167969v25.164063h-1.066406c-8.285156 0-15 6.71875-15 15 0 8.285156 6.714844 15 15 15h273.132812c8.285156 0 15-6.714844 15-15 0-8.28125-6.714844-15-15-15h-1.066406v-25.164063c0-30.417969-24.75-55.167969-55.167969-55.167969h-25.164062v-66.667968c11.324219-6.960938 22.195312-16.085938 32.480469-27.277344 45.367187-2.644531 87.359374-29.824219 118.890624-77.210938 31.894532-47.933593 49.460938-111.34375 49.460938-178.554687 0-8.285156-6.71875-15-15-15zm-422.5625 176.9375c-26.308594-39.539063-41.765625-91.246094-44.121094-146.9375h52.0625c5.410156 68.460937 21.480469 131.738281 46.597656 181.972656 4 8 8.183594 15.554688 12.523438 22.675781-24.949219-9.421874-48.039062-29.117187-67.0625-57.710937zm363.125 0c-19.023438 28.59375-42.113281 48.289063-67.0625 57.710937 4.34375-7.121093 8.523438-14.675781 12.523438-22.675781 25.117187-50.234375 41.183593-113.511719 46.597656-181.972656h52.0625c-2.355469 55.691406-17.8125 107.398437-44.121094 146.9375zm0 0"/></svg>
        <span>Leaderboard</span>
      </h2>
      <div className="timeRank">
        <span onClick={() => set("today")} className={actI === "today" ? "active" : ""}>today</span>
        <span onClick={() => set("week")} className={actI === "week" ? "active" : ""}>week</span>
        <span onClick={() => set("month")} className={actI === "month" ? "active" : ""}>month</span>
        <span onClick={() => set("")} className={actI === "" ? "active" : ""}>all time</span>
      </div>
      <ul className="board">
        {loading &&
          <p>loading...</p>
        }
        {top10 && 
          top10.map((el, i) => 
            <li key={i} className="rank">
              <span className={`num 
                c${i}
                ${i < 3 ? "top3" : "rest"}
              `}>
                {i+1}
              </span>
              <span className="cont">
                <span className="name">
                  {el.fullName}
                </span>
                <span className="score">
                  {el.highScore}
                </span>
              </span>
            </li>
          )
        }

      </ul>
      {rank > 10 &&
          <div key={11} className="rank">
          <span className="num rest">{rank}</span>
          <span className="cont">
            <span className="name">
              {info.fullName}
            </span>
            <span className="score">
              {info.highScore}
            </span>
          </span>
        </div>
        }
    </div>
  )
}

export default Leaderboard;