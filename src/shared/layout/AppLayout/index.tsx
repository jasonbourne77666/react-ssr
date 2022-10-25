import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import style from './index.module.scss';

function AppLayout() {
  // 随机字母
  const randomText = (): string => {
    const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const index = Math.random();
    return text[Math.floor(1 - index + index * text.length)];
  };

  function getRandomColor() {
    var col = 'rgb(';
    for (var i = 0; i < 3; i++) {
      col += Math.floor(Math.random() * 256) + ',';
    }
    var c = col.slice(0, -1);
    c += ')';
    return c;
  }

  const initCanvas = () => {
    const cvs: HTMLCanvasElement = document.querySelector('#layout-bg')!;
    const { clientHeight, clientWidth } = document.documentElement;
    cvs.width = clientWidth;
    cvs.height = clientHeight;
    const ctx = cvs.getContext('2d')!;

    // 列宽
    const columnWidth = 20;
    // 列数
    const columnCount = Math.floor(clientWidth / columnWidth);
    // 每列写第几个文字
    const columnNextIndexes = new Array(columnCount);
    columnNextIndexes.fill(1);

    const draw = () => {
      const fz = 20;
      ctx.fillStyle = 'rgba(21,23,25,0.2)';
      ctx.fillRect(0, 0, clientWidth, clientHeight);

      ctx.font = `${fz}px serif`;
      ctx.fillStyle = getRandomColor();

      for (let i = 0; i < columnCount; i++) {
        const x = i * columnWidth;
        const y = fz * columnNextIndexes[i];
        // 绘制文字
        ctx.fillText(randomText(), x, y);
        if (y > clientHeight && Math.random() > 0.9) {
          columnNextIndexes[i] = 0;
        } else {
          columnNextIndexes[i]++;
        }
      }
    };
    setInterval(draw, 70);
  };

  useEffect(() => {
    initCanvas();
    console.log(getRandomColor());
  }, []);
  return (
    <div className={style.layout}>
      <canvas className={style['layout-bg']} id='layout-bg'></canvas>
      {/* <Header navPosition='right' className='reveal-from-bottom' /> */}
      <section className={style.section}>
        <div className='container'>
          <Outlet />
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
}

export default AppLayout;
