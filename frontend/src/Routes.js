import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const GameRoom = lazy(() => import("./pages/GameRoom"));
const Home = lazy(() => import("./pages/Home"));

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<div />}>
          <Route exact path="/room/:id">
            <GameRoom />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Suspense>
      </Switch>
    </Router>
  );
};

export default Routes;
