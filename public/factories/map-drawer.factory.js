(function () {
    'use strict';

    angular
        .module('meanMapApp')
        .factory('MapDrawerFactory', function () {

            /** Converts Given Points into Google Map Markers **/
            function convertToMapPoints(points) {
                // Clear the locations holder
                var locations = [];

                // Loop through all of the JSON entries provided in the response
                for (var i = 0; i < points.length; i++) {
                    var markers = points[i];
                    // Create popup windows for each record
                    var contentString =
                        '<p><b>Name</b>: ' + markers.name + '</br>' +
                        '<b>Type</b>: ' + markers.type + '</br>' +
                        '<b>Lat</b>: ' + markers.coordinates[0] + '</br>' +
                        '<b>Long</b>: ' + markers.coordinates[1] +
                        '</p>';

                    // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                    locations.push({
                        latlon: new google.maps.LatLng(markers.coordinates[0], markers.coordinates[1]),
                        message: new google.maps.InfoWindow({
                            content: contentString,
                            maxWidth: 320
                        }),
                        username: markers.name
                    });

                }

                // location is now an array populated with records in Google Maps format, only for points
                return locations;
            }

            /** Draws Polylines **/
            function triggerPolyline(linestrings, map) {
                var linestringNumber = Object.keys(linestrings).length;
                for (var i = 0; i < linestringNumber; i++) {
                    var geometries = linestrings[i];
                    var coords = geometries.geo.coordinates;
                    addPolyline(coords, map);
                }
            }

            /** Adds Polyline to Map **/
            function addPolyline(coords, map) {
                var polyline_coordinates = [];

                for (var i = 0; i < coords.length; i++) {
                    polyline_coordinates.push({
                        lat: coords[i][0],
                        lng: coords[i][1]
                    });
                }
                var new_polyline = new google.maps.Polyline({
                    path: polyline_coordinates,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                //Assign the newly created Polyline to the map
                new_polyline.setMap(map);
            }

            /** Draws Polygons **/
            function triggerPolygon(polygons, map) {
                var polygonNumber = Object.keys(polygons).length;
                for (var i = 0; i < polygonNumber; i++) {
                    var geometries = polygons[i];
                    var coords = geometries.geo.coordinates;
                    addPolygon(coords, map);
                }
            }

            /** Adds Polygon to Map **/
            function addPolygon(coords, map) {
                coords = coords[0];
                var polygon_coordinates = [];

                for (var i = 0; i < coords.length; i++) {
                    polygon_coordinates.push({
                        lat: parseFloat(coords[i][0]),
                        lng: parseFloat(coords[i][1])
                    });
                }
                var new_polygon = new google.maps.Polygon({
                    path: polygon_coordinates,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });

                //Assign newly created Polygon to the Map
                new_polygon.setMap(map);
            }

            return {
                convertToMapPoints : convertToMapPoints,
                triggerPolyline    : triggerPolyline,
                triggerPolygon     : triggerPolygon
            }
        });
})();

