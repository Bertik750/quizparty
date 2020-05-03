import React, {useContext} from 'react';
import { InfoContext } from '../info';
import Cookie from "js-cookie";

const Profile = () => {

  const [info, setInfo] = useContext(InfoContext);

  const signOut = () => {
    Cookie.remove('token')
    setInfo({});
  }  

  return (
    <div className="container">
      <p>profile</p>
      <p>{info.fullName}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default Profile;