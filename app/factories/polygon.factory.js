
var Geometries  = require('../models/geometry-model.js');

exports.findIntersections       = findIntersections;
exports.findPointsInsidePolygon = findPointsInsidePolygon;

/** Finds Linestrings Intersections **/
function findIntersections(req) {
    return new Promise( function (resolve, reject) {
        var polygonName = req.body.name;
        Geometries.findOne({name : polygonName, 'geo.type' : 'Polygon'}).then( function (polygonByName, error) {
            if(error){
                return reject({error : 'Polygon not Found'});
            }
            queryIntersections(polygonByName).then( function (response) {
                return resolve(response);
            });
        });
    });
}

function queryIntersections(polygonByName) {
    return new Promise( function (resolve, reject) {
        if (_.isEmpty(polygonByName) || _.isUndefined(polygonByName) || _.isNull(polygonByName)){
            return reject({ error : 'No Polygons found for that Name'});
        } else {
            query = Geometries.find({'geo.type' : 'Polygon'}).where( { geo : { $geoIntersects : { $geometry : { type: 'Polygon', coordinates: polygonByName.geo.coordinates  } } } } );
            queryExec(query).then( function (polygons) {
                if(polygons){
                    return resolve(polygons);
                }
                return reject({ error : 'No Polygons Found for '+polygonByName.name});
            });
        }
    });
}

/** Finds Points inside a given Polygon **/
function findPointsInsidePolygon(req) {
    return new Promise( function (resolve, reject) {
        var polygonName = req.body.name;
        Geometries.findOne({name : polygonName, 'geo.type' : 'Polygon'}).then( function (polygonByName, error) {
            if(error){
                return reject({error : 'Polygon not Found'});
            }
                pointsInsidePolygon(polygonByName).then( function (response) {
                    return resolve(response);
                });
        });
    });
}

function pointsInsidePolygon(polygonByName) {
    return new Promise( function (resolve, reject) {
        if (_.isEmpty(polygonByName) || _.isUndefined(polygonByName) || _.isNull(polygonByName)){
            return reject({ error : 'No Linestrings found for that Name'});
        } else {
            query = Geometries.find({'geo.type' : 'Point'}).where( { geo : { $geoWithin : { $geometry : { type: 'Polygon', coordinates: polygonByName.geo.coordinates  } } } } );
            queryExec(query).then( function (points) {
                if(points){
                    return resolve(points);
                }
                return reject({ error : 'No Points Found for '+polygonByName.name});
            });
        }
    });
}

/** Executes the Query **/
function queryExec(query) {
    return new Promise(function(resolve, reject){
        query.exec(function (err, res) {
            if (err){
                return reject(err);
            }
            return resolve(res);
        })
    });
}