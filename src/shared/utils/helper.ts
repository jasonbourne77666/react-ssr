export const delay = (time = 500) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, time),
  );
