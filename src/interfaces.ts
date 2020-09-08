import { QueryConfig, QueryResult } from 'pg';

export interface IPGClient {
    end: () => Promise<void>;
    release: () => Promise<void>;
    query(sql: string | QueryConfig, values?: any[]): Promise<QueryResult>;
}

export interface IPGMockData {
    [index: string]: {
        query: string;
        response: any;
        valDefs: any[];
    };
}
