
var Geometries = require('../models/geometry-model.js');

exports.findNeighbours = findNeighbours;

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
            var query = Geometries.find({'geo.type' : 'Point'});

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('geo').near({
                center: {
                    type: 'Point',
                    coordinates: [long, lat]
                },

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34,
                spherical: true
            });
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, markers) {
            if (err){
                return reject({err : 'Error while executing query'});
            }
            // If no errors, respond with a JSON of all points that meet the criteria
            return resolve(markers);
        });

    });

}