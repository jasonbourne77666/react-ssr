import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { incrementByAmount } from '@/shared/store/user/userSlice';
import { list as testList } from './data';
import { AppContext } from '@/shared/context/AppContext';

import styles from './index.module.css';

function Home() {
  const { pageData = {} } = useContext(AppContext);
  const dispatch = useAppDispatch();
  const useReducer = useAppSelector((state) => state.users);
  const { list = [], tdk = {} } = pageData;

  useEffect(() => {
    dispatch(incrementByAmount(100));
  }, []);

  return (
    <div>
      <Helmet>
        <title>{tdk.title}</title>
        <meta name='description' content={tdk.description} />
        <meta name='keywords' content={tdk.keywords} />
      </Helmet>
      <h1>home{useReducer.value}</h1>
      <Link to={'/app/login'}>login</Link>
      <ul>
        {list.map((item, index) => (
          <li
            onClick={() => {
              console.log(index);
            }}
            key={index}
          >
            <h5 className={styles.test}>{item.title}</h5>
            <img width={100} height={100} src={item.img} alt='' />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const HomeInitialProps = async function () {
  // await delay(200);
  return {
    list: testList,
    tdk: {
      title: '首页home',
      keywords: '默认关键词',
      description: '默认描述',
    },
  };
};

export default Home;
