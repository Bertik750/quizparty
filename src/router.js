import React from "react";
import App from "./App";
const routes = {
  "/": () => <App />,
  "/join/:id": ({id}) => <App roomId={id} />,
};

export default routes;