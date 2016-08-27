'use strict';

angular
    .module('meanMapApp')
    .controller('QueryController', QueryController);

function QueryController($scope, $http, $rootScope, $window, $timeout, GeolocationService, GoogleServiceFactory, RedirectFactory) {

    var vm = this;

    /** Default Search View **/
    vm.formView = 'partials/close-points.html';

    /** Used to browse search views **/
    vm.goToView = function(view){
        RedirectFactory.goTo(view).then( function (url) {
            vm.formView = url;
            $scope.$apply();
            /** refreshing **/
            getCurrentLoc();
        })
    };

    // Initializes Variables
    // ----------------------------------------------------------------------------
    vm.formData = {};
    vm.queryBody = {};
    vm.coords = {};

    getCurrentLoc();

    /** Gets current location and refreshes with results or not **/
    function getCurrentLoc(params) {
        GeolocationService.getCurrentLoc().then( function (coordinates) {
            vm.formData.longitude = parseFloat(coordinates.long).toFixed(3);
            vm.formData.latitude  = parseFloat(coordinates.lat).toFixed(3);
            if(params){
              GoogleServiceFactory.refresh(coordinates.lat, coordinates.long, params);
            }
            if(_.isUndefined(params)){
                GoogleServiceFactory.refresh(coordinates.lat, coordinates.long, false);
            }
        });
    }


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

        if(vm.queryBody.distance < 0){
            $window.alert('Distance cannot be negative!');
            return;
        }
        if(vm.queryBody.distance === 0){
            $window.alert('Distance cannot be 0!');
            return;
        }

        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/find-neighbours', vm.queryBody)

        // Store the filtered results in queryResults
            .success(function(queryResults) {

                /** refreshing on current location and results **/
                getCurrentLoc(queryResults);

                // Count the number of records retrieved for the panel-footer
                vm.queryCount = queryResults.length;
                if (vm.queryCount===1) {
                    vm.neighbours = 'Neighbour';
                } else if (vm.queryCount > 1) {
                    vm.neighbours = 'Neighbours';
                } else if (vm.queryCount === 0){
                    vm.neighbours = 'No neighbours found.';
                }
                vm.showBox = true;
            })
            .error(function(queryResults) {
                console.log('Error ' + JSON.stringify(parseFloat(queryResults)));
            })
    };

    /** Looks for LineStrings intersecting a given linestring **/
    vm.findLinestringIntersections = function () {
        vm.queryBody = {
            name : vm.formData.poly1
        };
        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/find-poly-intersection', vm.queryBody)
        // Store the filtered results in queryResults
            .success(function(intersections) {
                /** refreshing on current location and results **/
                getCurrentLoc(intersections);

                if(intersections.error){
                    console.log('Error ' + intersections.error);
                    vm.intersections = 'LineString '+vm.queryBody.name+' does not exist';
                }

                vm.linestringName = vm.queryBody.name;
                vm.queryCount = intersections.length;
                if(vm.queryCount-1 > 1){
                    vm.intersections  = 'Found '+(vm.queryCount-1)+' intersections for '+vm.linestringName;
                } else if(vm.queryCount-1 === 1){
                    vm.intersections  = 'Found '+(vm.queryCount-1)+' intersection for '+vm.linestringName;
                } else if(vm.queryCount-1 === 0){
                    vm.intersections = 'No Intersections found for '+vm.linestringName;
                }
                vm.showBox = true;
            });
    };

    /** Looks for Polygons intersecting a given polygon **/
    vm.findPolygonIntersections = function () {
        vm.queryBody = {
            name : vm.formData.areaId1
        };
        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/find-polygon-intersections', vm.queryBody)
        // Store the filtered results in queryResults
            .success(function(intersections) {
                /** refreshing on current location and results **/
                getCurrentLoc(intersections);

                if(intersections.error){
                    console.log('Error ' + intersections.error);
                    vm.intersections = 'Polygon '+vm.queryBody.name+' does not exist';
                }

                vm.polygonName = vm.queryBody.name;
                vm.queryCount  = intersections.length;

                if(vm.queryCount > 1){
                    vm.intersections  = 'Found '+(vm.queryCount-1)+' intersections for '+vm.polygonName;
                } else if(vm.queryCount === 1){
                    vm.intersections  = 'No Intersections found for '+vm.polygonName;
                }
                vm.showBox = true;
            });
    };

    /** Looks for Polygons intersecting a given polygon **/
    vm.findPointsInsidePolygon = function () {
        vm.queryBody = {
            name : vm.formData.area1
        };
        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/find-points-inside-polygon', vm.queryBody)
        // Store the filtered results in queryResults
            .success(function(points) {
                /** refreshing on current location and results **/
                getCurrentLoc(points);

                if(points.error){
                    console.log('Error ' + points.error);
                    vm.points = 'Polygon '+vm.queryBody.name+' does not exist';
                }

                vm.polygonName = vm.queryBody.name;
                vm.queryCount  = points.length;

                if(vm.queryCount > 1){
                    vm.points  = 'Found '+(vm.queryCount-1)+' points for '+vm.polygonName;
                } else if(vm.queryCount === 1){
                    vm.points  = 'No points found for '+vm.polygonName;
                }
                vm.showBox = true;
            });
    };

}
