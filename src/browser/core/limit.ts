import {
  setSelectLimit as internalSet,
  clearSelectLimit as internalClear,
} from 'sqlectron-db-core/database';
import * as config from './config';

export async function setSelectLimit() {
  const { limitQueryDefaultSelectTop } = await config.get();
  if (limitQueryDefaultSelectTop !== null && limitQueryDefaultSelectTop !== undefined) {
    internalSet(limitQueryDefaultSelectTop);
  }
}

export function clearSelectLimit() {
  internalClear();
}
