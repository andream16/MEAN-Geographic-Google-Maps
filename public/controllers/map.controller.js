angular
    .module('meanMapApp')
    .controller('MapController', MapController);

function MapController($scope, GeometryFactory, $rootScope, GeolocationService, GoogleServiceFactory, RedirectFactory, VIEWS) {

    /** Variable Initialization **/
    var vm      = this;
    vm.formData = {};
    vm.coords   = {};
    vm.linestringCoords = {};
    var linestringPath;
    var polygonPath;
    var map = null;

    /** Default Search View **/
    vm.formView = VIEWS.point;

    /** Redirects to other pages **/
    vm.goTo = function(view){
        RedirectFactory.goToMap(view).then( function (url) {
            vm.formView = url;
            $scope.$apply();
            /** refreshing **/
            getCurrentLocation();
            /** Checking current view **/
            checkView();
        })
    };

    /** Initializing Position Marker **/
    getCurrentLocation();
    /** Checks View **/
    checkView();

    /** Setting Position Marker on current position **/
    function getCurrentLocation() {
        GeolocationService.getCurrentLoc().then( function (coordinates) {
            vm.currentLat  = vm.formData.latitude  = parseFloat(coordinates.lat).toFixed(3);
            vm.currentLong = vm.formData.longitude = parseFloat(coordinates.long).toFixed(3);
            GoogleServiceFactory.refresh(coordinates.lat, coordinates.long, false);
        });
    }

    /** Based on which Geometry we want to add **/
    function checkView() {
        $rootScope.$on("clicked", function(){
            if(vm.formView === VIEWS.point){
                $scope.$apply(function(){
                    vm.formData.latitude  = parseFloat(GoogleServiceFactory.clickLat).toFixed(3);
                    vm.formData.longitude = parseFloat(GoogleServiceFactory.clickLong).toFixed(3);
                });
            }
            if(vm.formView === VIEWS.linestring){
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: {lat: 40, lng: -30}  // Center the map on Chicago, USA.
                });
                var poly = new google.maps.Polyline({
                    strokeColor: '#000000',
                    strokeOpacity: 1.0,
                    strokeWeight: 3
                });
                poly.setMap(map);
                // Add a listener for the click event
                map.addListener('click', addLatLngLine);
                // Handles click events on a map, and adds a new point to the Polyline.
                function addLatLngLine(event) {
                    linestringPath = poly.getPath();
                    // Because path is an MVCArray, we can simply append a new coordinate
                    // and it will automatically appear.
                    linestringPath.push(event.latLng);
                    // Add a new marker at the new plotted point on the polyline.
                    var marker = new google.maps.Marker({
                        position: event.latLng,
                        title: '#' + linestringPath.getLength(),
                        map: map
                    });
                }
            }
            if(vm.formView === VIEWS.polygon){
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: {lat: 40, lng: -30}  // Center the map on Chicago, USA.
                });
                var poly = new google.maps.Polyline({
                    strokeColor: '#000000',
                    strokeOpacity: 1.0,
                    strokeWeight: 3
                });
                poly.setMap(map);
                // Add a listener for the click event
                map.addListener('click', addLatLngPoly);
                // Handles click events on a map, and adds a new point to the Polyline.
                function addLatLngPoly(event) {
                    polygonPath = poly.getPath();
                    // Because path is an MVCArray, we can simply append a new coordinate
                    // and it will automatically appear.
                    polygonPath.push(event.latLng);
                    // Add a new marker at the new plotted point on the polyline.
                    var marker = new google.maps.Marker({
                        position: event.latLng,
                        title: '#' + polygonPath.getLength(),
                        map: map
                    });
                }
            }

        });
    }

    vm.createPoint = function(){
        GeometryFactory.createPoint(vm.formData.username, [ parseFloat(vm.formData.longitude), parseFloat(vm.formData.latitude) ], 'Point').then( function () {
            // Once complete, clear the form (except location)
            vm.formData.username = "";
            // Refresh the map with new data
            getCurrentLocation();
        });
    };

    vm.createLinestring = function () {
        GeometryFactory.createLinestring(vm.formData.username, linestringPath, 'LineString').then( function () {
            // Once complete, clear the form (except location)
            vm.formData.username = "";
            // Refresh the map with new data
            getCurrentLocation();
        });

    };
    vm.createPolygon = function () {
        GeometryFactory.createPolygon(vm.formData.username, polygonPath, 'Polygon').then( function () {
            // Once complete, clear the form (except location)
            vm.formData.username = "";
            // Refresh the map with new data
            getCurrentLocation();
        });
    };

}