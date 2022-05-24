import React from 'react';
import { Route, Routes, useRoutes } from 'react-router-dom';

import AppLayout from '@/shared/layout/AppLayout';
import Home from '@/shared/pages/home';
import Login from '@/shared/pages/login';

const NotFound = () => {
  return <div>NotFound</div>;
};

export const routes = [
  { path: '/', element: <Home /> },
  {
    path: 'app',
    element: <AppLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  { path: '*', element: <NotFound /> },
];

function Router() {
  const element = useRoutes(routes);
  return element;
}

export default Router;
