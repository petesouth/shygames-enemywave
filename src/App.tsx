import { useEffect, useRef } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { AppMainGameFeed } from './views/AppMainGameFeed';
import { NotFound } from './views/NotFound';
import theme, { getGlobalStyles } from './style';
import { ThemeProvider } from '@material-ui/core/styles';

const AppRouter = () => {
  const classes = getGlobalStyles();

  return (<ThemeProvider theme={theme}>
    <div className={classes.root}>
      <Router >
        <Routes>
          <Route path="/shyhumangames-gamefeed/" element={<AppMainGameFeed />} />
          <Route path="/" element={<AppMainGameFeed />} />
        </Routes>
      </Router>
    </div>
  </ThemeProvider>)
}

export default AppRouter;

