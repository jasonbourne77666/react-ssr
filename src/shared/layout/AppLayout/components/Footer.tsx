import React from 'react';
import classNames from 'classnames';
import Logo from './partials/Logo';
import FooterNav from './partials/FooterNav';
import FooterSocial from './partials/FooterSocial';
import './Footer.scss';

const Footer = () => {
  const classes = classNames('site-footer center-content-mobile', 'has-top-divider');

  return (
    <footer className={classes}>
      <div className='container'>
        <div className={classNames('site-footer-inner', 'has-top-divider')}>
          <div className='footer-top space-between text-xxs'>
            <Logo />
            <FooterSocial />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
