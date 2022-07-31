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
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        path: 'home',
        element: <Home />,
        getInitialProps: HomeInitialProps,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  { path: '*', element: <NotFound /> },
];

const Router = () => {
  const loaction = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (loaction.pathname === '/') {
      navigate('/app/home');
    }
  }, [loaction.pathname]);

  return useRoutes(routes);
};

export default Router;
