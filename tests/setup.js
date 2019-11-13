global.consoleLog = console.log;
global.consoleError = console.error;
global.consoleWarn = console.warn;
global.console.log = () => {};
global.console.error = () => {};
global.console.warn = () => {};