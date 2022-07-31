import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Logo from './partials/Logo';
import './Header.scss';

const Header = ({ className = '', navPosition }) => {
  const [isActive, setIsactive] = useState(false);

  const nav = useRef<HTMLElement>(null);
  const hamburger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener('keydown', keyPress);
    document.addEventListener('click', clickOutside);
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('click', clickOutside);
      closeMenu();
    };
  });

  const openMenu = () => {
    document.body.classList.add('off-nav-is-active');
    nav.current!.style.maxHeight = nav.current!.scrollHeight + 'px';
    setIsactive(true);
  };

  const closeMenu = () => {
    document.body.classList.remove('off-nav-is-active');
    nav.current && (nav.current!.style.maxHeight = '');
    setIsactive(false);
  };

  const keyPress = (e: KeyboardEvent) => {
    isActive && e.keyCode === 27 && closeMenu();
  };

  const clickOutside = (e) => {
    if (!nav.current) return;
    if (!isActive || nav.current.contains(e.target) || e.target === hamburger.current) return;
    closeMenu();
  };

  const classes = classNames('site-header', 'has-bottom-divider', className);

  return (
    <header className={classes}>
      <div className='container'>
        <div className={classNames('site-header-inner', 'has-bottom-divider')}>
          <Logo />
          {
            <>
              <button ref={hamburger} className='header-nav-toggle' onClick={isActive ? closeMenu : openMenu}>
                <span className='screen-reader'>Menu</span>
                <span className='hamburger'>
                  <span className='hamburger-inner'></span>
                </span>
              </button>
              <nav ref={nav} className={classNames('header-nav', isActive && 'is-active')}>
                <div className='header-nav-inner'>
                  <ul className={classNames('list-reset text-xs', navPosition && `header-nav-${navPosition}`)}>
                    <li>
                      <Link to='#0' onClick={closeMenu}>
                        Documentation
                      </Link>
                    </li>
                  </ul>

                  <ul className='list-reset header-nav-right'>
                    <li>
                      <Link to='#0' className='button button-primary button-wide-mobile button-sm' onClick={closeMenu}>
                        Sign up
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </>
          }
        </div>
      </div>
    </header>
  );
};

export default Header;
