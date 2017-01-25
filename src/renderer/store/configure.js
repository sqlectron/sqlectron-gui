import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { createLogger } from '../../browser/remote';


const middlewares = [thunkMiddleware];

/* eslint global-require:0 */
if (global.SQLECTRON_CONFIG.log.console) {
  const loggerConfig = {
    level: global.SQLECTRON_CONFIG.log.level,
    collapsed: true,
  };

  if (global.SQLECTRON_CONFIG.log.file) {
    const logger = createLogger('renderer:redux');
    logger.log = logger.debug.bind(logger);
    loggerConfig.logger = logger;
    loggerConfig.colors = {}; // disable formatting

    // log only the error messages
    // otherwise is too much private information
    // the user would need to remove to issue a bug
    loggerConfig.stateTransformer = () => null;
    loggerConfig.actionTransformer = (data) => {
      const error = data && data.error;
      return { error };
    };
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
