require('mongoose').set('debug', true);
var Linestrings  = require('../models/geometry-model.js');

exports.findIntersections = findIntersections;

/** Finds Linestrings Intersections **/
function findIntersections(req) {
    return new Promise( function (resolve, reject) {
        var lineName = req.body.name;
        Linestrings.findOne({name : lineName, 'geo.type' : 'LineString'}).then( function (linestringById) {
            if(_.isNull(linestringById)){
                return reject({error : 'LineString not Found'});
            }
                queryIntersections(linestringById).then( function (response) {
                    return resolve(response);
                });
        });
    });
}

function queryIntersections(linestringById) {
    return new Promise( function (resolve, reject) {
        if (_.isEmpty(linestringById) || _.isUndefined(linestringById) || _.isNull(linestringById)){
            return reject({ error : 'No Linestrings found for that Name'});
        } else {
            query = Linestrings.find({'geo.type' : 'LineString'}).where( { geo : { $geoIntersects : { $geometry : { type: 'LineString', coordinates: linestringById.geo.coordinates  } } } } );
            queryExec(query).then( function (intersections) {
                if(intersections){
                    return resolve(intersections);
                }
                return reject({ error : 'No Linestrings Found for '+linestringById.name});
            });
        }
    });
}

/** Executes the Query **/
function queryExec(query) {
    return new Promise(function(resolve, reject){
            query.exec(function (err, intersections) {
                if (err){
                    return reject({err : 'Error while executing query'});
                }
                return resolve(intersections);
            });
    });
}