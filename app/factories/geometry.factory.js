require('mongoose').set('debug', true);
var Geometries  = require('../models/geometry-model.js');

exports.getGeometries = getGeometries;
exports.postGeometry  = postGeometry;

/** Gets all the geometries stored in the DB **/
function getGeometries() {
    return new Promise( function (resolve, reject) {
        var query = Geometries.find({});
        query.exec(function(err, geometries) {
            if (err){
                return reject({err : 'Error while fetching geometries'});
            }
            // If no errors are found, it responds with a JSON of all geometries
            return resolve(geometries);
        });
    }, function (){
        return reject({err : 'Error while fetching geometries'});
    });
}

/** Posting a new geometry **/
function postGeometry(req) {
    return new Promise( function (resolve, reject) {
        // Creates a new Geometry based on the Mongoose schema and the post body
        var newGeometry = new Geometries(req.body);
        console.log('req',req.body);
        // New Geometry is saved in the db.
        newGeometry.save(function(err) {
            if (err){
                return reject({err : 'Error while saving geometries'});
            }
            // If no errors are found, it responds with a JSON of the new polygon
            return resolve(req.body);
        });
    }, function (){
        return reject({err : 'Error while posting a new geometry'});
    });
}