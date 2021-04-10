import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import GameRoom from "./pages/GameRoom";
const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/room/:id">
          <GameRoom />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
