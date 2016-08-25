/** Requiring Factories **/
var MarkerFactory     = require('./factories/marker.factory.js');
var LinestringFactory = require('./factories/linestring.factory.js');
var PolygonFactory    = require('./factories/polygon.factory.js');
var GeometryFactory   = require('./factories/geometry.factory.js');

// Opens App Routes
module.exports = function(app) {

    /** Getting all the geometries **/
    app.get('/geometries', function(req, res) {
        GeometryFactory.getGeometries().then( function (geometry) {
            res.json(geometry);
        }, function (error) {
            res.json(error);
        });
    });

    /** Posting a new geometry **/
    app.post('/geometries', function(req, res) {
        GeometryFactory.postGeometry(req).then( function (geometry) {
            return res.json(geometry);
        }, function (error) {
            res.json(error);
        });
    });

    // Retrieves JSON records for all points near a given distance from a certain point
    app.post('/find-neighbours', function(req, res) {
        MarkerFactory.findNeighbours(req).then( function (neighbours) {
            return res.json(neighbours);
        }, function (error) {
            return res.json(error);
        })
    });

    // Retrieves JSON records for all linestrings intersecting a given one
    app.post('/find-poly-intersection', function(req, res) {
        LinestringFactory.findIntersections(req).then( function (linestrings) {
            return res.json(linestrings);
        }, function (error) {
            return res.json(error);
        })
    });

    // Retrieves JSON records for all polygons intersecting a given one
    app.post('/find-polygon-intersections', function(req, res) {
        PolygonFactory.findIntersections(req).then( function (polygons) {
            return res.json(polygons);
        }, function (error) {
            return res.json(error);
        })
    });

    // Retrieves JSON records for all points inside a given polygon
    app.post('/find-points-inside-polygon', function(req, res) {
        PolygonFactory.findPointsInsidePolygon(req).then( function (points) {
            return res.json(points);
        }, function (error) {
            return res.json(error);
        })
    });

};
