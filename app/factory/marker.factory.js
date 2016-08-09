
var Markers  = require('../models/marker-model.js');

exports.getMarkers = getMarkers;
exports.postMarker = postMarker;

/** Gets all the markers stored in the DB **/
function getMarkers() {
    return new Promise( function (resolve, reject) {
        var query = Markers.find({});
        query.exec(function(err, markers) {
            if (err){
                return reject(err);
            }
            // If no errors are found, it responds with a JSON of all points
            return resolve(markers);
        });
    }, function (error){
        return reject(error);
    });
}

/** Posting a new marker **/
function postMarker(req) {
    return new Promise( function (resolve, reject) {
        // Creates a new Point based on the Mongoose schema and the post body
        var newMarker = new Markers(req.body);
        // New Points is saved in the db.
        newMarker.save(function(err) {
            if (err){
                reject(err);
            }
            // If no errors are found, it responds with a JSON of the new point
            resolve(req.body);
        });
    }, function (error){
        return reject(error);
    });
}