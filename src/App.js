import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Settings from "./screen/settings";
import Grid from "./screen/grid";

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
          <Route path="/grid">
            <Grid />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
export default App;
