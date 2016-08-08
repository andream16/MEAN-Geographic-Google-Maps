'use strict';

angular
    .module('meanMapApp')
    .controller('MapController', MapController);

function MapController($scope, $http, $rootScope, geolocation, GoogleServiceFactory) {

        /** Variable Initialization **/
        var vm      = this;
        vm.formData = {};
        vm.coords   = {};

        /** Initializing Position Marker **/
        getCurrentLocation();

        /** Setting Position Marker on current position **/
        function getCurrentLocation() {
            geolocation.getLocation().then(function(data) {
                vm.currentLat  = vm.formData.latitude  = data.coords.latitude;
                vm.currentLong = vm.formData.longitude = data.coords.longitude;
            })
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
                coordinates : [vm.formData.latitude, vm.formData.longitude]
            };

            // Saves marker data to the db
            $http.post('/markers', userData)
                .success(function() {
                    // Once complete, clear the form (except location)
                    vm.formData.username = "";
                    // Refresh the map with new data
                    GoogleServiceFactory.refresh(vm.currentLat, vm.currentLong);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

}