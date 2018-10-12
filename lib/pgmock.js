/**
 * An NPM module for mocking a connection to a PostgreSQL database.
 * @module pgmock
 * @author Jason Favrod <mail@jasonfavrod.com>
 * @version 1.0.0
 */
module.exports = function() {
    let pgMock = {};
    let data = {};

    const
    LATENCY = 200;
    
    // Return the rawQuery in lowercase, without spaces nor
    // a trailing semicolon.
    normalize = function(rawQuery) {
        let norm;
        norm = rawQuery.toLowerCase().replace(/\s/g,'');
        return norm.replace(/;$/,'');
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
     * Add a query, it's value definitions, and reponse to the
     * mock database.
     * @param {string} query An SQL query statement.
     * @param {array} valueDefs Contains the types of each value used
     * in the query.
     * @param {object} response The simulated expected response of
     * the given query.
     */
    pgMock.add = function(query, valueDefs, response) {
        data[normalize(query)] = {
            valDefs: valueDefs,
            response: response
        };
    };


    /**
     * Get a simulated pg.Client or pg.Pool connection.
     * @returns {object}
     */
    pgMock.connect = function() {
        let connection = {};

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
                            reject(new Error('invalid query'))
                        }, LATENCY);
                    }
                    else {
                        setTimeout(function() {
                            reject(new Error('invalid values'))
                        }, LATENCY);
                    }
                }
            });
        };


        connection.release = function() { return true };
        connection.end = function() { return true };

        return connection;
    };

    return pgMock;
};
