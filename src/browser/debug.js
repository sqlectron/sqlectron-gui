import debug from 'debug';


export default (namespace) => debug(`sqlectron-gui:${namespace || '*'}`);
