import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Settings from "./screen/settings";
import Map from "./screen/map";
import Confirmation from "./screen/confirmation";
const App = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Router>
        <Switch>
          <Route exact path="/">
            <Settings />
          </Route>
          <Route path="/map">
            <Map />
          </Route>
          <Route path="/confirmation">
            <Confirmation />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
export default App;
