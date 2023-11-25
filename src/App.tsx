import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { AppMainGameFeed } from './views/AppMainGameFeed';
import { getGlobalStyles } from './style';

const AppRouter = () => {
  const classes = getGlobalStyles;

  return (<div style={{ ...classes.root}}>
      <Router >
        <Routes>
          <Route path="/shyhumangames-gamefeed/" element={<AppMainGameFeed />} />
          <Route path="/" element={<AppMainGameFeed />} />
        </Routes>
      </Router>
    </div>)
}

export default AppRouter;

