import React, {useState, useEffect, useContext} from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { InfoContext } from './info';
import Register from './account/Register';
import Login from './account/Login';
import Profile from './account/Profile';

const Account = () => {

  const [info, setInfo] = useContext(InfoContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const tokenos = Cookie.get("token") ? Cookie.get("token") : null;
    if(tokenos) {
      const getProfile = async () => {
        try {
          const response = await axios.get('http://localhost:8080/user/profile', {headers: {"token":tokenos}});
          setLoading(false);
          if(response.status === 200) {
            setInfo(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      }
      getProfile();
    } else {
      setLoading(false);
    }
  }, [setInfo]);

  return (
    <div>
      {loading ?
        <p>loading</p>
        :
        info.name ?
        <Profile />
        :
        <div className="container">
          Guest
          <Login />
          <Register />
        </div>
      }
    </div>
  );
}

export default Account;