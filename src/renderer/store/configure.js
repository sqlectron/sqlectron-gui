import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { createLogger } from '../../browser/remote';


const middlewares = [thunkMiddleware];

/* eslint global-require:0 */
const isLogConsoleEnabled = global.SQLECTRON_CONFIG.log.console;
const isLogFileEnabled = global.SQLECTRON_CONFIG.log.file;

if (isLogConsoleEnabled || isLogFileEnabled) {
  const loggerConfig = {
    level: global.SQLECTRON_CONFIG.log.level,
    collapsed: true,
  };

  if (isLogFileEnabled) {
    const mainLogger = createLogger('renderer:redux');

    loggerConfig.logger = {};

    for (const method in console) { // eslint-disable-line no-restricted-syntax
      if (typeof console[method] === 'function') { // eslint-disable-line no-console
        loggerConfig.logger[method] = function levelFn(...args) {
          console[method].apply(console, args); // eslint-disable-line no-console

          // log on file only messages with error
          // otherwise is too much private information
          // the user would need to remove to issue a bug
          const lastArg = args[args.length - 1];
          if (lastArg && lastArg.error) {
            mainLogger.error('Error', lastArg.error);
            mainLogger.error('Error Stack', lastArg.error.stack);
          }
        };
      }
    }
  }

  middlewares.push(require('redux-logger')(loggerConfig));
}


const createStoreWithMiddleware = applyMiddleware(
  ...middlewares
)(createStore);


export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
