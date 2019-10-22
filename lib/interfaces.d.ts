import { QueryResult } from 'pg';
export interface IPGClient {
    end: () => Promise<void>;
    query(sql: string, values: any[]): Promise<QueryResult>;
    release: () => Promise<void>;
}
