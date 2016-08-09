
var Polygons  = require('../models/polygon-model.js');

exports.getPolygons = getPolygons;
exports.postPolygon = postPolygon;

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