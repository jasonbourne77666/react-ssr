import React, { FC, useEffect } from 'react';
// import Router from './pages/rooter';

const App: FC = () => {
  useEffect(() => {
    console.log('App');
  }, []);
  return (
    // <React.Fragment>
    //   <Router />
    // </React.Fragment>
    <div className='test'>
      <button
        onClick={() => {
          alert('一起来玩 react ssr 呀。');
        }}
      >
        click here!
      </button>
    </div>
  );
};

export default App;
