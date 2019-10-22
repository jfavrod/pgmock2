"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var md5_1 = __importDefault(require("md5"));
/**
 * An NPM module for mocking a connection to a PostgreSQL database.
 * @author Jason Favrod <mail@jasonfavrod.com>
 * @example
 * ```
 * const PGMock2 = require('pgmock2'),
 * const pgmock = new PGMock2();
 * ```
 */
var PGMock2 = /** @class */ (function () {
    function PGMock2() {
        this.data = {};
        this.latency = 20;
    }
    PGMock2.prototype.setLatency = function (latency) {
        this.latency = latency;
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
     * ```
     * pgmock.add("SELECT * FROM employees WHERE id = $1", ['number'], {
     *     rowCount: 1,
     *     rows: [
     *         { id: 0, name: 'John Smith', position: 'application developer' }
     *     ]
     * });
     * ```
     */
    PGMock2.prototype.add = function (query, valueDefs, response) {
        this.data[this.normalize(query)] = {
            query: query,
            valDefs: valueDefs,
            response: response
        };
    };
    ;
    /**
     * Get a simulated pg.Client or pg.Pool connection.
     * @namespace connect
     * @returns {object}
     * @example const conn = pgmock.connect();
     */
    PGMock2.prototype.connect = function () {
        var _this = this;
        var connection = {
            /**
             * Simulate ending a pg connection.
             * @memberof connect
             * @example conn.release();
             */
            end: function () { return new Promise(function (res) { return res(); }); },
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
            query: function (sql, values) {
                var norm = _this.normalize(sql);
                var validQuery = _this.data[norm];
                return new Promise(function (resolve, reject) {
                    if (validQuery && _this.validVals(values, validQuery.valDefs)) {
                        setTimeout(function () {
                            resolve(validQuery.response);
                        }, _this.latency);
                    }
                    else {
                        if (!validQuery) {
                            setTimeout(function () {
                                reject(new Error('invalid query: ' + sql + ' query hash: ' + norm));
                            }, _this.latency);
                        }
                        else {
                            setTimeout(function () {
                                reject(new Error('invalid values: ' + JSON.stringify(values)));
                            }, _this.latency);
                        }
                    }
                });
            },
            /**
             * Simulate releasing a pg connection.
             * @memberof connect
             * @example conn.release();
             */
            release: function () { return new Promise(function (res) { return res(); }); },
        };
        return connection;
    };
    ;
    /**
     * Remove a query from the mock database.
     * @param {string} query An SQL statement added with the add method.
     * @returns {boolean} true if removal successful, false otherwise.
     */
    PGMock2.prototype.drop = function (query) {
        return delete this.data[this.normalize(query)];
    };
    ;
    /**
     * Flushes the mock database.
     */
    PGMock2.prototype.dropAll = function () {
        this.data = {};
    };
    ;
    // Return the rawQuery in lowercase, without spaces nor
    // a trailing semicolon.
    PGMock2.prototype.normalize = function (rawQuery) {
        var norm = rawQuery.toLowerCase().replace(/\s/g, '');
        return md5_1.default(norm.replace(/;$/, '')).toString();
    };
    /**
     * Return a string representation of the mock database.
     * @example
     * ```
     * {
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
     * ```
     */
    PGMock2.prototype.toString = function () {
        return JSON.stringify(this.data, null, 2);
    };
    ;
    PGMock2.prototype.validVals = function (values, defs) {
        var bool = true;
        if (values && values.length) {
            if (!defs.length || values.length !== defs.length) {
                throw Error('invalid values: Each value must have a corresponding definition.');
            }
            values.forEach(function (val, i) {
                if (typeof (defs[i]) === 'string') {
                    if (typeof (val) !== defs[i])
                        bool = false;
                }
                else if (typeof (defs[i]) === 'function') {
                    if (!defs[i](val))
                        bool = false;
                }
            });
        }
        return bool;
    };
    return PGMock2;
}());
exports.default = PGMock2;
