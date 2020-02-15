import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { StoreContextProvider } from './state/StoreContext';
import Home from './Home';
import Proxy from './Proxy';

function App() {

  return (
    <StoreContextProvider>
      <Router>
        <Switch>
          <Route path="/" exact>
              <Home />
          </Route>
          <Route path="/proxy">
            <Proxy />
          </Route>
        </Switch>
      </Router>
    </StoreContextProvider>
  );
}

export default App;
