import { Pool } from 'pg';

export default class ReqPgPool {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    public hasPool(): boolean {
        return (
            this.pool
            && typeof(this.pool.end) === 'function'
            && typeof(this.pool.query) === 'function'
        )
    }
}
