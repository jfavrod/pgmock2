import { IPGClient } from './interfaces';

/** @ignore */
export function isIPGClient(obj: any): obj is IPGClient{
    return (
        'end' in obj
        && 'release' in obj
        && 'query' in obj
        && typeof(obj.end) === 'function'
        && typeof(obj.release) === 'function'
        && typeof(obj.query) === 'function'
    );
}
