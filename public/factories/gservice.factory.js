(function () {
    'use strict';

    angular
        .module('meanMapApp')
        .factory('GoogleServiceFactory', function (MapDrawerFactory, $rootScope, $http) {

            //Initializing Variables
            var vm               = this;
            var googleMapService = {};
            var currentSelectedMarker;
            var lastMarker;
            var icon;

            // Handling Clicks and location selection
            googleMapService.clickLat  = 0;
            googleMapService.clickLong = 0;

            // Array of locations obtained from API calls
            var locations   = [];
            var linestrings = [];
            var polygons    = [];

            vm.selectedLat  = 39.000;
            vm.selectedLong = 9;

            //Initializes Map
            var map = null;

            //Gets all the linestrings from DB
            getLinestrings();
            function getLinestrings() {
                $http.get('/linestrings').success(function (response) {
                    linestrings = response;
                }).error(function (error) {
                    console.log(error);
                });
            }

            //Gets all the polygons from DB
            getPolygons();
            function getPolygons() {
                $http.get('/polygons').success(function (response) {
                    polygons = response;
                }).error(function (error) {
                    console.log(error);
                });
            }

            /** Refresh the Map with new data. Function will take new latitude and longitude coordinates. */
            googleMapService.refresh = function (latitude, longitude, filteredResults) {

                // Clears the holding array of locations
                locations = [];

                // Set the selected lat and long equal to the ones provided on the refresh() call
                vm.selectedLat  = latitude;
                vm.selectedLong = longitude;

                // If filtered results are provided in the refresh() call...
                if (filteredResults) {

                    // Then convert the filtered results into map points.
                    locations = MapDrawerFactory.convertToMapPoints(filteredResults);

                    // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                    initialize(latitude, longitude, true);
                }

                // If no filter is provided in the refresh() call...
                else {

                    // Perform an AJAX call to get all of the records in the db.
                    $http.get('/markers').success(function (response) {

                        locations = MapDrawerFactory.convertToMapPoints(response);

                        // Then initialize the map -- noting that no filter was used.
                        initialize(latitude, longitude, false);
                    }).error(function () {
                    });
                    
                }
            };

            // Initializes the map
            var initialize = function (latitude, longitude, filter) {

                // If map has not been created...
                if (!map) {

                    // Create a new map and place in the index.html page
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 3,
                        center: new google.maps.LatLng(vm.selectedLat, vm.selectedLong)
                    });
                }

                // If a filter was used set the icons yellow, otherwise blue
                if (filter) {
                    icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
                } else {
                    icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
                }

                // Loop through each location in the array and place a marker
                locations.forEach(function (n) {
                    var marker = new google.maps.Marker({
                        position: n.latlon,
                        map: map,
                        title: "Big Map",
                        icon: icon
                    });

                    // For each marker created, add a listener that checks for clicks
                    google.maps.event.addListener(marker, 'click', function (e) {

                        // When clicked, open the selected marker's message
                        currentSelectedMarker = n;
                        n.message.open(map, marker);
                    });
                });

                /** Draws Polylines **/
                MapDrawerFactory.triggerPolyline(linestrings, map);
                /** Draws Polygons **/
                MapDrawerFactory.triggerPolygon(polygons, map);

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
                google.maps.event.addListener(map, 'click', function (e) {
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
            google.maps.event.addDomListener(window, 'load', googleMapService.refresh(vm.selectedLat, vm.selectedLong));
            return googleMapService;

        });
})();

