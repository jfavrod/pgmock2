import { Client, Pool } from 'pg';
import PGMock2 from './PGMock2';

export default PGMock2;

export const getClient = (pgmock?: PGMock2): Client => {
    pgmock = pgmock || new PGMock2();
    return pgmock as unknown as Client;
};

export const getPool = (pgmock?: PGMock2): Pool => {
    pgmock = pgmock || new PGMock2();
    return pgmock as unknown as Pool;
};
