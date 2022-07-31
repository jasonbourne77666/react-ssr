import React, { Fragment } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import style from './index.module.scss';

function AppLayout() {
  return (
    <Fragment>
      <Header navPosition='right' className='reveal-from-bottom' />
      <section className={style.section}>
        <div className='container'>
          <Outlet />
        </div>
      </section>
      <Footer />
    </Fragment>
  );
}

export default AppLayout;
