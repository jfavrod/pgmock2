module.exports = function() {
    let pgMock = {};

    let data = {};

    // Return the rawQuery in lowercase, without spaces nor
    // a trailing semicolon.
    const
    LATENCY = 200;
    
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


    pgMock.add = function(query, valueDefs, response) {
        data[normalize(query)] = {
            valDefs: valueDefs,
            response: response
        };
    };


    pgMock.query = function(sql, values) {
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

    return pgMock;
};
