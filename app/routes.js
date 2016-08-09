// Dependencies
var mongoose          = require('mongoose');
var Markers           = require('./models/marker-model.js');
var MarkerFactory     = require('./factory/marker.factory.js');
var LinestringFactory = require('./factory/linestring.factory.js');
var PolygonFactory    = require('./factory/polygon.factory.js');

// Opens App Routes
module.exports = function(app) {

    /** Getting all the markers **/
    app.get('/markers', function(req, res) {
        MarkerFactory.getMarkers().then( function (data) {
            return res.json(data);
        });
    });

    /** Posting a new marker **/
    app.post('/markers', function(req, res) {
        MarkerFactory.postMarker(req).then( function (data) {
            res.json(data);
        });
    });

    /** Getting all the linestrings **/
    app.get('/linestrings', function(req, res) {
        LinestringFactory.getLinestrings().then( function (data) {
            res.json(data);
        }, function (error) {
            res.json(error);
        });
    });

    /** Posting a new linestring **/
    app.post('/linestrings', function(req, res) {
        LinestringFactory.postLinestring(req).then( function (data) {
            return res.json(data);
        }, function (error) {
            res.json(error);
        });
    });

    /** Getting all the polygon **/
    app.get('/polygons', function(req, res) {
        PolygonFactory.getPolygons().then( function (data) {
            res.json(data);
        }, function (error) {
            res.json(error);
        });
    });

    /** Posting a new polygon **/
    app.post('/polygons', function(req, res) {
        PolygonFactory.postPolygon(req).then( function (data) {
            return res.json(data);
        }, function (error) {
            res.json(error);
        });
    });

    // Retrieves JSON records for all points who meet a certain set of query conditions
    app.post('/query/', function(req, res) {

        // Grab all of the query parameters from the body.
        var lat = req.body.latitude;
        var long = req.body.longitude;
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
                res.send(err);
            }
            // If no errors, respond with a JSON of all points that meet the criteria
            res.json(markers);
        });
    });

};
