// Dependencies
var mongoose = require('mongoose');
var GeoObjects = require('./model.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all Objects in the db
    app.get('/objects', function(req, res) {

        // Uses Mongoose schema to run the search (empty conditions)
        var query = GeoObjects.find({});
        query.exec(function(err, geoObjects) {
            if (err){
              return res.send(err);
            }

            // If no errors are found, it responds with a JSON of all Objects
            res.json(geoObjects);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new Objects in the db
    app.post('/objects', function(req, res) {

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newGeoObject = new GeoObjects(req.body);
        console.log("New User "+JSON.stringify(newGeoObject));

        // New User is saved in the db.
        newGeoObject.save(function(err) {
            if (err){
              return res.send(err);
            }

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });

    // Retrieves JSON records for all Points Closest to a given point
    app.post('/query/', function(req, res) {

        // Grab all of the query parameters from the body.
        var lat = req.body.latitude;
        var long = req.body.longitude;
        var distance = parseFloat(req.body.distance);

        console.log(lat,long,distance);

        var points = GeoObjects.find({'location.type':'Point'});

        if (distance) {
            var query = points.near('coordinates', {
                          center: {
                            type: 'Point',
                            coordinates: [parseFloat(lat), parseFloat(long)]
                          },
                          // Converting meters to miles
                          maxDistance: distance * 1609.34,
                          spherical: true
            });
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, geoObjects) {
            if (err){
              res.send(err);
            }
            if (!geoObjects) {
              console.log(JSON.stringify(geoObjects));

            }else {
              // If no errors, respond with a JSON of all Objects that meet the criteria
              res.json(geoObjects);
              console.log(JSON.stringify(geoObjects));
            }
        });
    });
};
