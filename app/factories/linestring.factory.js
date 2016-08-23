require('mongoose').set('debug', true);
var Linestrings  = require('../models/linestring-model.js');

exports.getLinestrings    = getLinestrings;
exports.postLinestring    = postLinestring;
exports.findIntersections = findIntersections;

/** Gets all the linestrings stored in the DB **/
function getLinestrings() {
    return new Promise( function (resolve, reject) {
        var query = Linestrings.find({});
        query.exec(function(err, linestrings) {
            if (err){
                return reject(err);
            }
            // If no errors are found, it responds with a JSON of all linestrings
            return resolve(linestrings);
        });
    }, function (error){
        return reject(error);
    });
}

/** Posting a new marker **/
function postLinestring(req) {
    // console.log('factory '+JSON.stringify(req.body));
    return new Promise( function (resolve, reject) {
        // Creates a new Linestring based on the Mongoose schema and the post body
        var newLinestring = new Linestrings(req.body);
        // New Linestring is saved in the db.
        newLinestring.save(function(err) {
            if (err){
                return reject(err);
            }
            // If no errors are found, it responds with a JSON of the new linestring
            return resolve(req.body);
        });
    }, function (error){
        return reject(error);
    });
}

/** Finds Linestrings Intersections **/
function findIntersections(req) {
    return new Promise( function (resolve, reject) {
        var lineName = req.body.name;
        Linestrings.findOne({name : lineName}).then( function (linestringById, error) {
            if(error){
                return reject({error : 'LineString not Found'});
            }
                queryIntersections(linestringById).then( function (response) {
                    return resolve(response);
                });
        });
    }, function (error) {
        return reject({error : 'Error while executing promise'});
    });
}

function queryIntersections(linestringById) {
    return new Promise( function (resolve, reject) {
        if (_.isEmpty(linestringById) || _.isUndefined(linestringById) || _.isNull(linestringById)){
            return reject({ error : 'No Linestrings found for that Name'});
        } else {
            query = Linestrings.where( { geo : { $geoIntersects : { $geometry : { type: 'LineString', coordinates: linestringById.geo.coordinates  } } } } );
            queryExec(query).then( function (intersections) {
                if(intersections){
                    return resolve(intersections);
                }
                return reject({ error : 'No Linestrings Found for '+linestringById.name});
            });
        }
    }, function (error){
       return reject({error : 'Error while executing promise'});
    });
}

/** Executes the Query **/
function queryExec(query) {
    return new Promise(function(resolve, reject){
            query.exec(function (err, intersections) {
                if (err){
                    return reject(err);
                }
                return resolve(intersections);
            });
    }, function (error) {
        return reject({error : 'Error while executing promise'});
    });
}