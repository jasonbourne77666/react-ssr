import React, { useEffect } from 'react';
import { list } from './data';
import { delay } from '@/shared/utils/helper';

function Home() {
  useEffect(() => {}, []);

  return (
    <div>
      <h1>home</h1>
      <ul>
        <li></li>
      </ul>
    </div>
  );
}

Home.getInitialProps = async function () {
  await delay();
  return list;
};

export default Home;
