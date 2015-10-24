import debug from 'debug';


export default (namespace) => debug(`sqlectron:${namespace || '*'}`);
