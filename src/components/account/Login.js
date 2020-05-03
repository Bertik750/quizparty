import React, {useContext, useState} from 'react';
import { useForm } from "react-hook-form";
import { InfoContext } from '../info';
import './Account.css';
import axios from 'axios';
import Cookie from "js-cookie";

const Login = ({start, setDidLogin}) => {

  const [info, setInfo] = useContext(InfoContext);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const { handleSubmit, register, errors } = useForm();

  const handleOpen = () => {
    setOpen(!open);
  }

  const onSubmit = async (values, e) => {
    e.preventDefault();
    Object.keys(values).forEach((key) => (!values[key]) && delete values[key]);
    try {
      const response = await axios.post('http://localhost:8080/auth/login', values);
      if(response.status === 200) {
        const tokenos = response.data[0];
        Cookie.set("token", tokenos);
        e.target.reset();
        setOpen(false);
        if(start) {
          setDidLogin(true);
        }
        setInfo(response.data[1]);
      }
    } catch (error) {
      console.log(error);
      if(typeof error.response.data === 'string') {
        setError(error.response.data);
      }
    }
  };



  return (
    <div>
      <button onClick={handleOpen}>Login</button>
      {open &&
        <div className="overlay">
            <div className="reg">
              <span className="xx" onClick={handleOpen}>X</span>
              <h2>Log in</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <label>Name:</label>
                <input
                  name="name"
                  ref={register({
                    required: 'Required',
                  })}
                />
                {errors.name && errors.name.message}

                <label>Password:</label>
                <input
                  name="password"
                  type="password"
                  ref={register({
                    required: 'Required',
                  })}
                />
                {errors.password && errors.password.message}

                <button type="submit">Log in</button>
                {error &&
                  <p>{error}</p>
                }
              </form>
            </div>
        </div>
      }
    </div>
  );
}

export default Login;