// Dependencies
var mongoose = require('mongoose');
var GeoObjects = require('./model.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all points in the db
    app.get('/geoObjects', function(req, res) {

        // Uses Mongoose schema to run the search (empty conditions)
        var query = GeoObjects.find({});
        query.exec(function(err, geoObjects) {
            if (err){
              res.send(err);
              return;
            }

            // If no errors are found, it responds with a JSON of all points
            res.json(geoObjects);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new points in the db
    app.post('/geoObjects', function(req, res) {

        // Creates a new Point based on the Mongoose schema and the post body
        var newObj = new GeoObjects(req.body);

        // New Points is saved in the db.
        newObj.save(function(err) {
          if (err){
            res.send(err);
            return;
          }

            // If no errors are found, it responds with a JSON of the new point
            res.json(req.body);
        });
    });

    // Retrieves JSON records for all points who meet a certain set of query conditions
    app.post('/query/', function(req, res) {

        // Grab all of the query parameters from the body.
        var lat = req.body.latitude;
        var long = req.body.longitude;
        var distance = req.body.distance;

        // Check if distance is valid
        if (distance !== 'undefined' && distance !== 'null' && (distance/distance)===1){

            // Opens a generic Mongoose Query. Depending on the post body we will...
            var query = GeoObjects.find({'type':'Point'});

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
        query.exec(function(err, geoObjects) {
            if (err){
                res.send(err);
            }
            // If no errors, respond with a JSON of all points that meet the criteria
            res.json(geoObjects);
        });
    });

    /*
    app.post('/pointsWithinArea', function (req, res){

      var areaId = req.body.areaId;
      var area = GeoObjects.find('type':'Polygon', 'name':'areaId');

      result = area.where('coordinates').geoIntersects({'geometry': {'type':'Point'}});

      result.exec(function(err, within){
        if (err) {
          res.send(err);
        }
        res.json(within);
      });
    });*/

};
