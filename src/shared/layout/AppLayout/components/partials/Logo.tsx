import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Image from '@/shared/components/elements/Image';
import LogoImg from '@/shared/assets/images/favicon.png';

const Logo = () => {
  const classes = classNames('brand');

  return (
    <div className={classes}>
      <Link style={{ display: 'block' }} to='/app/home'>
        <Image src={LogoImg} alt='Logo' width={32} height={32} />
      </Link>
    </div>
  );
};

export default Logo;
