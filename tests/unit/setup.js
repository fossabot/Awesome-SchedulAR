global.console.time = jest.fn();
global.console.timeEnd = jest.fn();
global.console.log = jest.fn();

// set async time out to 20 seconds
jest.setTimeout(20000);
