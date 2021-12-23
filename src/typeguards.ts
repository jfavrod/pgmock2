import { IPGClient } from './interfaces';

/** @ignore */
export const isIPGClient = (obj: IPGClient | Record<string, unknown>): obj is IPGClient => (
    'end' in obj
    && 'release' in obj
    && 'query' in obj
    && typeof(obj.end) === 'function'
    && typeof(obj.release) === 'function'
    && typeof(obj.query) === 'function'
);
