import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';


const middlewares = [ thunkMiddleware ];


if (process.env.NODE_ENV !== 'production') {
  middlewares.push(require('redux-logger')({
    level: 'info',
    collapsed: true,
  }));
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
