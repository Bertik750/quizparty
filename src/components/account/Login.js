import React, {useContext, useState} from 'react';
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { InfoContext } from '../context/info';
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
        console.log(response.data[1]);
        setInfo(response.data[1]);
      }
    } catch (error) {
      console.log(error);
      if(typeof error.response.data === 'string') {
        setError(error.response.data);
      }
    }
  };

  const variants = {
    open: { scale: 1 },
    closed: { scale: 0 },
  }
  const overlay = {
    open: { opacity: 1, zIndex: 2 },
    closed: { opacity: 0, zIndex: -1 },
  }

  return (
    <div>
      <button className="loginButton profileButton" onClick={handleOpen}>LogIn</button>
        <motion.div className="overlay" initial={false} animate={open ? "open" : "closed"} variants={overlay}>
            <motion.div className="reg" initial={false} animate={open ? "open" : "closed"} variants={variants}>
              <span className="xx" onClick={handleOpen}>X</span>
              <h2>LogIn</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="formContainer">
                  <span className="logRegError">{errors.name && errors.name.message}</span>
                  <input
                    className="logRegInput"
                    aria-invalid={errors.name ? "true" : "false"}
                    name="name"
                    placeholder="name or email"
                    ref={register({
                      required: 'Required',
                    })}
                  />
                  
                  <span className="logRegError">{errors.password && errors.password.message}</span>
                  <input
                    className="logRegInput"
                    aria-invalid={errors.password ? "true" : "false"}
                    name="password"
                    type="password"
                    placeholder="password"
                    ref={register({
                      required: 'Required',
                    })}
                  />

                  <button type="submit" className="submit">LogIn</button>
                  {error &&
                    <span className="finalError">{error}</span>
                  }
                </div>
              </form>
            </motion.div>
        </motion.div>
    </div>
  );
}

export default Login;