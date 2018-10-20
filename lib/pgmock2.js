/**
 * An NPM module for mocking a connection to a PostgreSQL database.
 * @module pgmock2
 * @author Jason Favrod <mail@jasonfavrod.com>
 * @version 1.0.0
 * @example const pgmock = require('pgmock2'),
 * pgMock = pgmock(); 
 */
module.exports = function() {
    const
    md5 = require('md5');

    /** @instance */
    let pgMock = {};

    // Holds the mock data.
    let data = {};

    const
    LATENCY = 20;
    
    // Return the rawQuery in lowercase, without spaces nor
    // a trailing semicolon.
    normalize = function(rawQuery) {
        let norm;
        norm = rawQuery.toLowerCase().replace(/\s/g,'');
        return md5(norm.replace(/;$/,''));
    },

    
    validVals = function(values, defs) {
        let bool = true;

        if (values && values.length) {
            if (defs && defs.length && (values.length === defs.length)) {
                values.forEach( (val, i) => {
                    if (typeof(val) !== defs[i]) bool = false;
                });
            }
            else {
                bool = false;
            }
        }

        return bool;
    };


    /**
     * Add a query, it's value definitions, and response to the
     * mock database.
     * @param {string} query An SQL query statement.
     * @param {array} valueDefs Contains the types of each value used
     * in the query.
     * @param {object} response The simulated expected response of
     * the given query.
     * @example
     * pgMock.add("SELECT * FROM employees WHERE id = $1", ['number'], {
     *     rowCount: 1,
     *     rows: [
     *         { id: 0, name: 'John Smith', position: 'application developer' }
     *     ]
     * });
     */
    pgMock.add = function(query, valueDefs, response) {
        data[normalize(query)] = {
            query: query,
            valDefs: valueDefs,
            response: response
        };
    };


    /**
     * Remove a query from the mock database.
     * @param {string} query An SQL statement added with the add method.
     * @returns {boolean} true if removal successful, false otherwise.
     * @example pgMock.drop("SELECT * FROM employees WHERE id = $1");
     */
    pgMock.drop = function(query) {
        return delete data[normalize(query)];
    };

    /**
     * Flushes the mock database.
     * @example pgMock.dropAll();
     */
    pgMock.dropAll = function() {
        data = {};
    };


    /**
     * Return a string representation of the mock database.
     * @example pgMock.toString();
     * @example {
     *     "3141ffa79e40392187830c52d0588f33": {
     *         "query": "SELECT * FROM tpd_hawaii_it.projects",
     *         "valDefs": [],
     *         "response": {
     *             "rowCount": 3,
     *             "rows": [
     *                 {
     *                     "title": "Test Project 0",
     *                     "status": "pending",
     *                     "priority": "low",
     *                     "owner": "Favrod, Jason"
     *                 },
     *                 {
     *                     "title": "Test Project 1",
     *                     "status": "pending",
     *                     "priority": "low",
     *                     "owner": "Favrod, Jason"
     *                 },
     *             ]
     *         }
     *     },
     *     "81c4b35dfd07db7dff2cb0e91228e833": {
     *         "query": "SELECT * FROM tpd_hawaii_it.projects WHERE title = $1",
     *         "valDefs": ["string"],
     *         "response": {
     *             "rowCount": 1,
     *             "rows": [
     *                 {
     *                     "title": "Test Project 0",
     *                     "status": "pending",
     *                     "priority": "low",
     *                     "owner": "Favrod, Jason"
     *                 }
     *             ]
     *         }
     *     }
     * }
     */
    pgMock.toString = function() {
        return JSON.stringify(data, null, 2);
    };


    /**
     * Get a simulated pg.Client or pg.Pool connection.
     * @namespace connect
     * @returns {object}
     * @example const conn = pgmock.connect();
     */
    pgMock.connect = function() {
        /** @instance */
        let connection = {};

        /**
         * Query the mock database.
         * @memberof connect
         * @param {string} sql An SQL statement.
         * @param {array} values Arguments for the SQL statement or
         * an empty array if no values in the statement.
         * @example conn.query('select * from employees where id=$1;', [0])
         * .then(data => console.log(data))
         * .catch(err => console.log(err.message));
         * @example {
         *   rowCount: 1,
         *   rows: [
         *       { id: 0, name: 'John Smith', position: 'application developer' } 
         *   ]
         * }
         */
        connection.query = function(sql, values) {
            let norm = normalize(sql);
            validQuery = data[norm];

            return new Promise( (resolve, reject) => {
                if (validQuery && validVals(values, data[norm].valDefs)) {
                    setTimeout(function() {
                        resolve(data[norm].response)
                    }, LATENCY);
                }
                else {
                    if (!validQuery) {
                        setTimeout(function() {
                            reject(new Error('invalid query: ' + sql + ' query hash: ' + normalize(sql)))
                        }, LATENCY);
                    }
                    else {
                        setTimeout(function() {
                            reject(new Error('invalid values: ' + JSON.stringify(values)))
                        }, LATENCY);
                    }
                }
            });
        };


        /**
         * Simulate releasing a pg connection.
         * @memberof connect
         * @example conn.release();
         */
        connection.release = function() { return true };

        /**
         * Simulate ending a pg connection.
         * @memberof connect
         * @example conn.release();
         */
        connection.end = function() { return true };

        return connection;
    };

    return pgMock;
};
