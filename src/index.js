import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { useRoutes } from "hookrouter";
import routes from "./router";

function SetRoutes() {
  const routeResult = useRoutes(routes);
  return routeResult || <App />;
}

ReactDOM.render(
  <React.StrictMode>
    <SetRoutes />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
