import { QueryResult } from 'pg';

export interface IPGClient {
    end: () => Promise<void>;
    release: () => Promise<void>;
    query(sql: string, values: any[]): Promise<QueryResult>;
}
