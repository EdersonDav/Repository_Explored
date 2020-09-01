import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Repository from '../pages/Repository';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/repository/:repository+" exect component={Repository} />
  </Switch>
);

export default Routes;
