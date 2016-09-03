(function () {
    'use strict';

    angular
        .module('meanMapApp')
        .factory('MapDrawerFactory', function () {

            /** Converts Given Points into Google Map Markers **/
            function convertToMapPoints(geometries) {
                // Clear the locations holder
                var locations = [];

                // Loop through all of the JSON entries provided in the response
                for (var i = 0; i < geometries.length; i++) {

                    if(geometries[i].geo.type === 'Point'){
                        var markers = geometries[i];
                        // Create popup windows for each record
                        var contentString =
                            '<p><b>Name</b>: ' + markers.name + '</br>' +
                            '<b>Type</b>: '    + markers.geo.type + '</br>' +
                            '<b>Lat</b>: '     + markers.geo.coordinates[0] + '</br>' +
                            '<b>Long</b>: '    + markers.geo.coordinates[1] +
                            '</p>';

                        // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                        locations.push({
                            latlon: new google.maps.LatLng( markers.geo.coordinates[1], markers.geo.coordinates[0] ),
                            message: new google.maps.InfoWindow({
                                content: contentString,
                                maxWidth: 320
                            }),
                            username: markers.name,
                            type : markers.geo.type
                        });
                    }

                    if(geometries[i].geo.type === 'LineString') {

                        var linestrings = geometries[i];
                        var polyline_coordinates = [];

                        // Create popup windows for each record
                        var contentString =
                            '<p><b>Name</b>: ' + linestrings.name + '</br>' +
                            '<b>Type</b>: '    + linestrings.geo.type + '</br>' +
                            '</p>';

                        for (var j = 0; j < linestrings.geo.coordinates.length; j++) {
                            polyline_coordinates.push({
                                lat: linestrings.geo.coordinates[j][1],
                                lng: linestrings.geo.coordinates[j][0]
                            });
                        }

                        // Converts each of the JSON records
                        locations.push({
                                coords: polyline_coordinates,
                                message: new google.maps.InfoWindow({
                                    content: contentString,
                                    maxWidth: 320
                                }),
                                username: linestrings.name,
                                type    : linestrings.geo.type
                            });

                    }

                    if(geometries[i].geo.type === 'Polygon') {

                        var polygons = geometries[i];
                        var polygon_coordinates = [];
                        var coords = polygons.geo.coordinates[0];

                        // Create popup windows for each record
                        var contentString =
                            '<p><b>Name</b>: ' + polygons.name + '</br>' +
                            '<b>Type</b>: '    + polygons.geo.type + '</br>' +
                            '</p>';

                        for (var j = 0; j < coords.length; j++) {
                            polygon_coordinates.push({
                                lat: coords[j][1],
                                lng: coords[j][0]
                            });
                        }

                        // Converts each of the JSON records
                        locations.push({
                            coords: polygon_coordinates,
                            message: new google.maps.InfoWindow({
                                content: contentString,
                                maxWidth: 320
                            }),
                            username: polygons.name,
                            type    : polygons.geo.type
                        });
                    }
                }

                // location is now an array populated with records in Google Maps format
                return locations;
            }

            return {
                convertToMapPoints : convertToMapPoints
            }
        });
})();

