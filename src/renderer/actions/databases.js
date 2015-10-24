import {
  FILTER_DATABASES,
} from './types';


export function filterDatabases(name) {
  return { type: FILTER_DATABASES, name };
}
