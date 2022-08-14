import React from 'react';
import { useRoutes, useNavigate, useLocation } from 'react-router-dom';

import AppLayout from '@/shared/layout/AppLayout';
import Home, { HomeInitialProps } from '@/shared/pages/home';
import Login from '@/shared/pages/login';

const NotFound = () => {
  return <div>NotFound</div>;
};

export const routes = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
        getInitialProps: HomeInitialProps,
      },
    ],
  },
  { path: '*', element: <NotFound /> },
];

const Router = () => {
  return useRoutes(routes);
};

export default Router;
