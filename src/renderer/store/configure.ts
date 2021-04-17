import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger as createReduxLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { sqlectron, CONFIG } from '../api';

const middlewares = [thunkMiddleware];

const isLogConsoleEnabled = CONFIG.log.console;
const isLogFileEnabled = CONFIG.log.file;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  }
}

if (isLogConsoleEnabled || isLogFileEnabled) {
  const loggerConfig = {
    level: CONFIG.log.level,
    collapsed: true,
    logger: {},
  };

  for (const method in console) {
    // eslint-disable-next-line no-console
    if (typeof console[method] === 'function') {
      // eslint-disable-line no-console
      loggerConfig.logger[method] = function levelFn(...args) {
        if (isLogConsoleEnabled) {
          const m = method === 'debug' ? 'log' : method;
          console[m](...args); // eslint-disable-line no-console
        }

        if (isLogFileEnabled) {
          // log on file only messages with error
          // otherwise is too much private information
          // the user would need to remove to issue a bug
          const lastArg = args[args.length - 1];
          if (lastArg && lastArg.error) {
            sqlectron.logger.error('Error', lastArg.error);
            sqlectron.logger.error('Error Stack', lastArg.error.stack);
          }
        }
      };
    }
  }

  middlewares.push(createReduxLogger(loggerConfig));
}

export default function configureStore(initialState?) {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancer(applyMiddleware(...middlewares)),
  );

  if (module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default));
  }

  return store;
}
