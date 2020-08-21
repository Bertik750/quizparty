import {useState, useEffect, useContext} from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { InfoContext } from '../components/context/info';

export default () => {

  const [info, setInfo] = useContext(InfoContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenos = Cookie.get("token") ? Cookie.get("token") : null;
    if(tokenos) {
      const getProfile = async () => {
        try {
          const response = await axios.get('http://localhost:8080/user/profile', {headers: {"token":tokenos}});
          if(response.status === 200) {
            setInfo(response.data);
            setLoading(false);
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
  return loading;
}