
var Markers  = require('../models/marker-model.js');

exports.getMarkers     = getMarkers;
exports.postMarker     = postMarker;
exports.findNeighbours = findNeighbours;


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

/** Finds point's neighbours given a distance **/
function findNeighbours(req) {
    return new Promise( function (resolve, reject) {
        // Grab all of the query parameters from the body.
        var lat      = req.body.latitude;
        var long     = req.body.longitude;
        var distance = req.body.distance;

        // Check if distance is valid
        if (!_.isUndefined(distance) && !_.isNull(distance) && _.isInteger(distance)){

            // Opens a generic Mongoose Query. Depending on the post body we will...
            var query = Markers.find({'type':'Point'});

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('coordinates').near({
                center: {
                    type: 'Point',
                    coordinates: [lat, long]
                },

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34,
                spherical: true
            });
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, markers) {
            if (err){
                return reject(err);
            }
            // If no errors, respond with a JSON of all points that meet the criteria
            return resolve(markers);
        });

    }, function (error){
       return reject(error);
    });

}