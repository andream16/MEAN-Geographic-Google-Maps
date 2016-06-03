// Creates the mapController Module and Controller. Note that it depends on the 'geolocation' module and service.
var mapController = angular.module('mapController', ['geolocation', 'gservice']);
mapController.controller('mapController', function($scope, $http, $rootScope, geolocation, gservice) {

    $scope.formView = 'partials/close-points.html';

    $scope.closestPointClicked = function (){
      if ($scope.formView != 'partials/closest-point.html') {
          $scope.formView = 'partials/closest-point.html';
      }
    };

    $scope.closePointsClicked = function (){
      if ($scope.formView != 'partials/close-points.html') {
          $scope.formView = 'partials/close-points.html';
      }
    };

    $scope.intAreaClicked = function (){
      if ($scope.formView != 'partials/area-intersection.html') {
          $scope.formView = 'partials/area-intersection.html';
      }
    };

    $scope.polyIntersectionClicked = function(){
      if ($scope.formView != 'partials/polylines-intersection.html') {
          $scope.formView = 'partials/polylines-intersection.html';
      }
    };

    $scope.pointsInsideAreaClicked = function(){
      if ($scope.formView != 'partials/points-inside-area.html') {
          $scope.formView = 'partials/points-inside-area.html';
      }
    };

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });


    // Functions
    // ----------------------------------------------------------------------------
    // Creates a new user based on the form fields
    $scope.createUser = function($rootScope, $on) {

        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            location: [$scope.formData.longitude, $scope.formData.latitude]
        };

        // Saves the user data to the db
        $http.post('/users', userData)
            .success(function(data) {

                // Once complete, clear the form (except location)
                $scope.formData.username = "";
                // Refresh the map with new data
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
});
