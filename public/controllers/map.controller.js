'use strict';

angular
    .module('meanMapApp')
    .controller('MapController', MapController);

function MapController($scope, $http, $rootScope, GeolocationService, GoogleServiceFactory) {

    /** Variable Initialization **/
    var vm      = this;
    vm.formData = {};
    vm.coords   = {};

    /** Initializing Position Marker **/
    getCurrentLocation();

    /** Setting Position Marker on current position **/
    function getCurrentLocation() {
        GeolocationService.getCurrentLoc().then( function (coordinates) {
            vm.currentLat  = vm.formData.latitude  = parseFloat(coordinates.lat).toFixed(3);
            vm.currentLong = vm.formData.longitude = parseFloat(coordinates.long).toFixed(3);
            GoogleServiceFactory.refresh(coordinates.lat, coordinates.long, false);
        });
    }

    /** Gets coordinates based on mouse click on the map. When a click event is detected **/
    $rootScope.$on("clicked", function(){
        // Refreshes shown coordinates
        $scope.$apply(function(){
            vm.formData.latitude  = parseFloat(GoogleServiceFactory.clickLat).toFixed(3);
            vm.formData.longitude = parseFloat(GoogleServiceFactory.clickLong).toFixed(3);
        });
    });

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

        // Saves marker data to the db
        $http.post('/geometries', userData)
            .success(function() {
                // Once complete, clear the form (except location)
                vm.formData.username = "";
                // Refresh the map with new data
                getCurrentLocation();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}