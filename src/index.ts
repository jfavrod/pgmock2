import { Client, Pool } from 'pg';
import PGMock2 from './PGMock2';

export default PGMock2;

export function getClient(pgmock?: PGMock2) {
    pgmock = pgmock || new PGMock2();
    return pgmock as unknown as Client;
}

export function getPool(pgmock?: PGMock2) {
    pgmock = pgmock || new PGMock2();
    return pgmock as unknown as Pool;
}
