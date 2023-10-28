import { useEffect, useRef } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { AppMainGameFeed } from './views/AppMainGameFeed';
import { NotFound } from './views/NotFound';

const AppRouter = () => {

  return (<Router >
    <Routes>
      <Route path="/shyhumangames-gamefeed/" element={<AppMainGameFeed />} />
      <Route path="/" element={<AppMainGameFeed />} />
    </Routes>
  </Router>)
}

export default AppRouter;

