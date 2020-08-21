import React, {useContext} from 'react';
import { InfoContext } from './context/info';
import { Facebook } from 'react-content-loader';
import Cookie from "js-cookie";
import Register from './account/Register';
import Login from './account/Login';
import Profile from './account/Profile';
import useUpdateInfo from '../utils/updateInfo';

const Account = () => {

  const [info, setInfo] = useContext(InfoContext);
  const loading = useUpdateInfo();

  const signOut = () => {
    Cookie.remove('token')
    Cookie.remove('subjectsCombination');
    setInfo({});
  }

  return (
    <div>
      <div className="boxTitle">
        <div style={{float: "right"}}>
          {info.name && <button className="signOut" onClick={signOut}>SignOut</button>}
        </div>
        <div className="centerProfile">Profile</div>
      </div>
      {loading ?
        <Facebook style={{margin: 20}}/>
        :
        info.name ?
        <Profile />
        :
        <div>
          <h3 className="accountName">Guest</h3>
          <div className="container">
            <Login />
            <Register />
          </div>
        </div>
      }
    </div>
  );
}

export default Account;