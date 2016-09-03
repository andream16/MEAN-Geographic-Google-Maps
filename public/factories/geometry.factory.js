
'use strict';

angular
    .module('meanMapApp')
    .factory('GeometryFactory', function ($http) {

        var vm = this;
        vm.coordinates;

        /** Creates a new Geometry based on its type and posts it **/
        function createGeometry(name, coordinates, type) {
          return new Promise( function (resolve, reject){
                switch(type){
                    case 'Point':
                        vm.coordinates = coordinates;
                        break;
                    case 'LineString':
                        vm.coordinates = coordinateParser(coordinates);
                        break;
                    case 'Polygon':
                        vm.coordinates = coordinateParser(coordinates);
                        vm.coordinates = polygonChecker(vm.coordinates);
                }
                if(vm.coordinates){
                    var geometryData = {
                        name        : name,
                        geo         : {
                            coordinates : vm.coordinates,
                            type        : type
                        }
                    };
                }
                if(geometryData){
                    postGeometry(geometryData).then(function (res) {
                        if(res.err){
                            return reject(res.err);
                        }
                        return resolve(res);
                    });
                }
          })
        }

        /** In case of LineStrings and Polygons parses their coordinates in proper format **/
        function coordinateParser(coordinates){
            vm.cords = [];
            var arrayCoordinates = coordinates.getArray();
            for(var j = 0; j<arrayCoordinates.length; j++){
                if(arrayCoordinates[j]){
                    vm.lat  =  parseFloat(arrayCoordinates[j].lat().toFixed(3));
                    vm.lon  =  parseFloat(arrayCoordinates[j].lng().toFixed(3));
                    vm.cords.push([ vm.lon, vm.lat ]);
                }
            }
            return vm.cords;
        }

        /** Checks if a polygon is closed, if not it closes it **/
        function polygonChecker(polygonCoordinates){
            if (_.head(polygonCoordinates) !== _.last(polygonCoordinates)) {
                polygonCoordinates.push(_.head(polygonCoordinates));
            }
            return [polygonCoordinates];
        }

        /** Posts a new geometry given userData **/
        function postGeometry(geometry){
            return new Promise(function (resolve, reject) {
                // Saves marker data to the db
                $http.post('/geometries', geometry)
                    .success(function(res) {
                        if(res.error){
                            return reject(res.error);
                        }
                        return resolve(res);
                    });
            });
        }

        return {
            createGeometry : createGeometry
        }
    });
