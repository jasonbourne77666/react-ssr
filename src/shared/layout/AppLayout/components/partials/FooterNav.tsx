import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const FooterNav = () => {
  const classes = classNames('footer-nav');

  return (
    <nav className={classes}>
      <ul className='list-reset'>
        <li>
          <Link to='#0'>Contact</Link>
        </li>
        <li>
          <Link to='#0'>About us</Link>
        </li>
        <li>
          <Link to='#0'>{"FAQ's"}</Link>
        </li>
        <li>
          <Link to='#0'>Support</Link>
        </li>
      </ul>
    </nav>
  );
};

export default FooterNav;
