angular
    .module('meanMapApp')
    .controller('MapController', MapController);

function MapController($scope, $http, $rootScope, GeolocationService, GoogleServiceFactory, RedirectFactory) {

    /** Variable Initialization **/
    var vm      = this;
    vm.formData = {};
    vm.coords   = {};
    vm.linestringCoords = {};
    var path;
    var map = null;

    /** Default Search View **/
    vm.formView = 'partials/add-points.html';

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
            if(vm.formView === 'partials/add-points.html'){
                $scope.$apply(function(){
                    vm.formData.latitude  = parseFloat(GoogleServiceFactory.clickLat).toFixed(3);
                    vm.formData.longitude = parseFloat(GoogleServiceFactory.clickLong).toFixed(3);
                });
            }
            if(vm.formView === 'partials/add-linestrings.html'){
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
                    path = poly.getPath();
                    // Because path is an MVCArray, we can simply append a new coordinate
                    // and it will automatically appear.
                    path.push(event.latLng);
                    // Add a new marker at the new plotted point on the polyline.
                    var marker = new google.maps.Marker({
                        position: event.latLng,
                        title: '#' + path.getLength(),
                        map: map
                    });
                }
            }
            if(vm.formView === 'partials/add-polygons.html'){
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
                    path = poly.getPath();
                    // Because path is an MVCArray, we can simply append a new coordinate
                    // and it will automatically appear.
                    path.push(event.latLng);
                    // Add a new marker at the new plotted point on the polyline.
                    var marker = new google.maps.Marker({
                        position: event.latLng,
                        title: '#' + path.getLength(),
                        map: map
                    });
                }
            }
        });
    }

    /** Creates a New Marker on submit **/
    vm.createPoint = function() {
        // Grabs all of the text box fields
        var userData = {
            name        : vm.formData.username,
            geo         : {
                            coordinates : [parseFloat(vm.formData.latitude), parseFloat(vm.formData.longitude)],
                            type        : 'Point'
            }
        };
        postData(userData);
    };

    /** Creates a New LineString on submit **/
    vm.createLinestring = function() {
        var linestringCoords = path.getArray();
        vm.cords = [];
        for(var j = 0; j<linestringCoords.length; j++){
            if(linestringCoords[j]){
                vm.lat  = parseFloat(linestringCoords[j].lat());
                vm.lon = parseFloat(linestringCoords[j].lng());
                vm.cords.push([ vm.lat , vm.lon]);
            }
        }
        // Grabs all of the text box fields
        if(vm.cords){
            var userData = {
                name        : vm.formData.username,
                geo         : {
                    coordinates : vm.cords,
                    type        : 'LineString'
                }
            };
            postData(userData);
        }
    };

    /** Creates a New Polygon on submit **/
    vm.createPolygon = function() {
        var polygonCoords = path.getArray();
        vm.polygon = [];
        for(var j = 0; j<polygonCoords.length; j++){
            if(polygonCoords[j]){
                vm.lat  = parseFloat(polygonCoords[j].lat());
                vm.lon = parseFloat(polygonCoords[j].lng());
                vm.polygon.push([ vm.lat , vm.lon]);
            }
        }
        if(_.head(vm.polygon) !== _.last(vm.polygon)){
            vm.polygon.push(_.head(vm.polygon));
        }
        // Grabs all of the text box fields
        if(vm.polygon){
            var userData = {
                name        : vm.formData.username,
                geo         : {
                    coordinates : [vm.polygon],
                    type        : 'Polygon'
                }
            };
        }
        postData(userData);
    };

    /** Posts a new geometry given userData **/
    function postData(geometry){
        // Saves marker data to the db
        $http.post('/geometries', geometry)
            .success(function(res) {
                // Once complete, clear the form (except location)
                vm.formData.username = "";
                // Refresh the map with new data
                getCurrentLocation();
                if(res.error){
                    console.log('Error'+res.error);
                }
            });
    }

}