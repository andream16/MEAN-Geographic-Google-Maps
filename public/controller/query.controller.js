'use strict';

angular
    .module('meanMapApp')
    .controller('QueryController', QueryController);

function QueryController($scope, $http, $rootScope, geolocation, GoogleServiceFactory, RedirectFactory) {

    var vm = this;

    /** Default Search View **/
    vm.formView = 'partials/close-points.html';

    /** Used to browse search views **/
    vm.goToView = function(view){
        RedirectFactory.goTo(view).then( function (url) {
            vm.formView = url;
            $scope.$apply();
        })
    };

    // Initializes Variables
    // ----------------------------------------------------------------------------
    vm.formData = {};
    vm.queryBody = {};
    vm.coords = {};

    // Functions
    // ----------------------------------------------------------------------------

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data) {
        vm.coords = {
            lat: data.coords.latitude,
            long: data.coords.longitude
        };

        // Set the latitude and longitude equal to the HTML5 coordinates
        vm.formData.longitude = parseFloat(vm.coords.long).toFixed(3);
        vm.formData.latitude = parseFloat(vm.coords.lat).toFixed(3);
    });

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function() {

        // Run the GoogleServiceFactory functions associated with identifying coordinates
        $scope.$apply(function() {
            vm.formData.latitude = parseFloat(GoogleServiceFactory.clickLat).toFixed(3);
            vm.formData.longitude = parseFloat(GoogleServiceFactory.clickLong).toFixed(3);
        });
    });

    // Take query parameters and incorporate into a JSON queryBody
    vm.findClosestPoints = function() {

        // Assemble Query Body
        vm.queryBody = {
            longitude : parseFloat(vm.formData.longitude),
            latitude  : parseFloat(vm.formData.latitude),
            distance  : parseFloat(vm.formData.distance)
        };

        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/query', vm.queryBody)

        // Store the filtered results in queryResults
            .success(function(queryResults) {

                // Pass the filtered results to the Google Map Service and refresh the map
                GoogleServiceFactory.refresh(vm.queryBody.latitude, vm.queryBody.longitude, queryResults);
                // Count the number of records retrieved for the panel-footer
                vm.queryCount = queryResults.length;
                if (vm.queryCount===1) {
                    vm.neighbours = 'Neighbour';
                } else if (vm.queryCount > 1) {
                    vm.neighbours = 'Neighbours';
                }
            })
            .error(function(queryResults) {
                console.log('Error ' + JSON.stringify(parseFloat(queryResults)));
            })
    };



}
