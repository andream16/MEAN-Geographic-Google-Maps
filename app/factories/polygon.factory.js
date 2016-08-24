
var Polygons  = require('../models/polygon-model.js');
var Points    = require('../models/marker-model.js');

exports.getPolygons             = getPolygons;
exports.postPolygon             = postPolygon;
exports.findIntersections       = findIntersections;
exports.findPointsInsidePolygon = findPointsInsidePolygon;

/** Gets all the linestrings stored in the DB **/
function getPolygons() {
    return new Promise( function (resolve, reject) {
        var query = Polygons.find({});
        query.exec(function(err, polygons) {
            if (err){
                return reject(err);
            }
            // If no errors are found, it responds with a JSON of all polygons
            return resolve(polygons);
        });
    }, function (error){
        return reject(error);
    });
}

/** Posting a new marker **/
function postPolygon(req) {
    return new Promise( function (resolve, reject) {
        // Creates a new Linestring based on the Mongoose schema and the post body
        var newPolygon = new Polygons(req.body);
        // New Polygon is saved in the db.
        newPolygon.save(function(err) {
            console.log(err);
            if (err){
                return reject(err);
            }
            // If no errors are found, it responds with a JSON of the new polygon
            return resolve(req.body);
        });
    }, function (error){
        return reject(error);
    });
}

/** Finds Linestrings Intersections **/
function findIntersections(req) {
    return new Promise( function (resolve, reject) {
        var polygonName = req.body.name;
        Polygons.findOne({name : polygonName}).then( function (polygonByName, error) {
            if(error){
                return reject({error : 'Polygon not Found'});
            }
            queryIntersections(polygonByName).then( function (response) {
                return resolve(response);
            });
        });
    }, function (error) {
        return reject({error : 'Error while executing promise'});
    });
}

function queryIntersections(polygonByName) {
    return new Promise( function (resolve, reject) {
        if (_.isEmpty(polygonByName) || _.isUndefined(polygonByName) || _.isNull(polygonByName)){
            return reject({ error : 'No Linestrings found for that Name'});
        } else {
            query = Polygons.where( { geo : { $geoIntersects : { $geometry : { type: 'Polygon', coordinates: polygonByName.geo.coordinates  } } } } );
            queryExec(query).then( function (polygons) {
                if(polygons){
                    return resolve(polygons);
                }
                return reject({ error : 'No Linestrings Found for '+polygonByName.name});
            });
        }
    });
}

/** Finds Linestrings Intersections **/
function findPointsInsidePolygon(req) {
    return new Promise( function (resolve, reject) {
        var polygonName = req.body.name;
        Polygons.findOne({name : polygonName}).then( function (polygonByName, error) {
            if(error){
                return reject({error : 'Polygon not Found'});
            }
                pointsInsidePolygon(polygonByName).then( function (response) {
                    return resolve(response);
                });
        });
    }, function (error) {
        return reject({error : 'Error while executing promise'});
    });
}

function pointsInsidePolygon(polygonByName) {
    return new Promise( function (resolve, reject) {
        if (_.isEmpty(polygonByName) || _.isUndefined(polygonByName) || _.isNull(polygonByName)){
            return reject({ error : 'No Linestrings found for that Name'});
        } else {
            query = Points.where( { geo : { $geoWithin : { $geometry : { type: 'Polygon', coordinates: polygonByName.geo.coordinates  } } } } );
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