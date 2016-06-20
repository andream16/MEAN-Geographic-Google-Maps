// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http) {

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};
        var selectedLat = 33.003;
        var selectedLong = 8.995;
        //Declaring Google Map to be used by external functions
        var map = null;

        // Handling Clicks and location selection
        googleMapService.clickLat = 0;
        googleMapService.clickLong = 0;

        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location


        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        googleMapService.refresh = function(latitude, longitude, filteredResults) {

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults) {

                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);

                // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {

                // Perform an AJAX call to get all of the records in the db.
                $http.get('/objects').success(function(response) {

                    // Then convert the results into map points
                    locations = convertToMapPoints(response);

                    // Then initialize the map -- noting that no filter was used.
                    initialize(latitude, longitude, false);
                }).error(function() {});
            }
        };

        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of users into map points
        var convertToMapPoints = function(response) {

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for (var i = 0; i < response.length; i++) {
                var user = response[i];

                //If it is a Point
                if (user.location.type === "Point") {
                    // Create popup windows for each record
                    var contentString =
                        '<p><b>Username</b>: ' + user.name + '</br>' +
                        '<b>Type</b>: ' + user.location.type + '</br>' +
                        '<b>Lat</b>: ' + user.location.coordinates[0] + '</br>' +
                        '<b>Long</b>: ' + user.location.coordinates[1] +
                        '</p>';

                    // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                    locations.push({
                        latlon: new google.maps.LatLng(user.location.coordinates[0], user.location.coordinates[1]),
                        message: new google.maps.InfoWindow({
                            content: contentString,
                            maxWidth: 320
                        }),
                        username: user.name,
                    });
                }

                //If type is a LineString, Call addPolylyne
                if (user.location.type === "LineString") {
                    addPolyline(user.location.coordinates, map);
                }

                //If type is a Polygon, Call addPolygon
                if (user.location.type === "Polygon") {
                    addPolygon(user.location.coordinates, map);
                };

            }
            // location is now an array populated with records in Google Maps format, only for points
            return locations;
        };

        //Function that draws Polylines
        function addPolyline(coords, map) {
            var polyline_coordinates = [];

            for (var i = 0; i < coords.length; i++) {
                polyline_coordinates.push({
                    lat: coords[i][0],
                    lng: coords[i][1]
                });
                //console.log("LineString "+  parseFloat(coords[i][0]), parseFloat(coords[i][1]));
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

        //Function that draws Polygons
        function addPolygon(coords, map) {
            //console.log(coords);

            coords = coords[0];
            var polygon_coordinates = [];

            //console.log(coords);
            //console.log("Polygon coordinates "+polygon_coordinates);

            for (var i = 0; i < coords.length; i++) {
                polygon_coordinates.push({
                    lat: parseFloat(coords[i][0]),
                    lng: parseFloat(coords[i][1])
                });
                //console.log(parseFloat(coords[i][0]), parseFloat(coords[i][1]));
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

        // Initializes the map
        var initialize = function(latitude, longitude, filter) {
            // Uses the selected lat, long as starting point

            var myLatLng = {
                lat: selectedLat,
                lng: selectedLong
            };

            // If map has not been created...
            if (!map) {

                // Create a new map and place in the index.html page
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: new google.maps.LatLng(selectedLat, selectedLong)
                });
            }

            // If a filter was used set the icons yellow, otherwise blue
            if (filter) {
                icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
            } else {
                icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            }

            // Loop through each location in the array and place a marker
            locations.forEach(function(n, i) {
                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: map,
                    title: "Big Map",
                    icon: icon,
                });

                // For each marker created, add a listener that checks for clicks
                google.maps.event.addListener(marker, 'click', function(e) {

                    // When clicked, open the selected marker's message
                    currentSelectedMarker = n;
                    n.message.open(map, marker);
                });
            });


            // Set initial location as a bouncing red marker
            var initialLocation = new google.maps.LatLng(latitude, longitude);


                var marker = new google.maps.Marker({
                    position: initialLocation,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });
                lastMarker = marker;


            // Function for moving to a selected location
            map.panTo(new google.maps.LatLng(latitude, longitude));

            // Clicking on the Map moves the bouncing red marker
            google.maps.event.addListener(map, 'click', function(e) {
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });

                // When a new spot is selected, delete the old red bouncing marker
                if (lastMarker) {
                    lastMarker.setMap(null);
                }

                // Create a new red bouncing marker and move to it
                  lastMarker = marker;
                  map.panTo(marker.position);


                // Update Broadcasted Variable (lets the panels know to change their lat, long values)
                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");
            });
        };

        // Refresh the page upon window load. Use the initial latitude and longitude
        google.maps.event.addDomListener(window, 'load',
        googleMapService.refresh(selectedLat, selectedLong));

        return googleMapService;
    });
