import chalk from 'chalk';

export const logMessage = (message: any, level: string = 'info') => {
  const color = level === 'error' ? 'red' : level === 'warning' ? 'yellow' : level === 'info' ? 'blue' : 'white';
  console.log(`[${new Date().toISOString()}]`, chalk[color](message));
};

export const compilerPromise = (name: string, compiler: any) => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      logMessage(`[${name}] Compiling `);
    });
    compiler.hooks.done.tap(name, (stats: any) => {
      if (!stats.hasErrors()) {
        logMessage(`[${name}] Compiled `);
        return resolve(true);
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};
