import React, { FC, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import Router from './pages/rooter';

import './App.module.css';
import favicon from '@/shared/assets/favicon.png';

const App: FC = () => {
  return (
    <Fragment>
      <Helmet defaultTitle='Mr J' link={[{ rel: 'icon', type: 'image/png', href: favicon }]} />
      <Router />
    </Fragment>
  );
};

export default App;
