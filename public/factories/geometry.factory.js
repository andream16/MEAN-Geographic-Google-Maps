
'use strict';

angular
    .module('meanMapApp')
    .factory('GeometryFactory', function ($http) {

        var vm             = this;
        var polygonData    = {};
        vm.polygon         = [];
        var linestringData = {};
        vm.cords           = [];


        /** Creates a New Marker on submit **/
        function createPoint(name, coordinates, type) {
            return new Promise( function (resolve, reject) {
                // Grabs all of the text box fields
                var markerData = {
                    name        : name,
                    geo         : {
                        coordinates : coordinates,
                        type        : type
                    }
                };
                if(markerData){
                    postGeometry(markerData).then(function (res) {
                        if(res.err){
                            return reject(res.err);
                        }
                        return resolve(res);
                    });
                }
            });
        }

        /** Creates a New LineString on submit **/
        function createLinestring(name, coordinates, type) {
            return new Promise( function (resolve, reject) {
                var linestringCoords = coordinates.getArray();
                linestringData = {};
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
                    linestringData = {
                        name: name,
                        geo: {
                            coordinates: vm.cords,
                            type: type
                        }
                    };
                }
                if(linestringData){
                    postGeometry(linestringData).then(function (res) {
                        linestringData = {};
                        vm.cords = [];
                        if(res.err){
                            return reject(res.err);
                        }
                        return resolve(res);
                    });
                }
            });
        }

        /** Creates a New Polygon on submit **/
        function createPolygon(name, coordinates, type) {
            return new Promise( function (resolve, reject) {
                var polygonCoords = coordinates.getArray();
                polygonData = {};
                vm.polygon = [];
                for (var j = 0; j < polygonCoords.length; j++) {
                    if (polygonCoords[j]) {
                        vm.lat = parseFloat(polygonCoords[j].lat());
                        vm.lon = parseFloat(polygonCoords[j].lng());
                        vm.polygon.push([vm.lat, vm.lon]);
                    }
                }
                // Grabs all of the text box fields
                if(vm.polygon){
                    if (_.head(vm.polygon) !== _.last(vm.polygon)) {
                        vm.polygon.push(_.head(vm.polygon));
                    }
                    polygonData = {
                        name: name,
                        geo: {
                            coordinates: [vm.polygon],
                            type: type
                        }
                    };
                }
                if(polygonData){
                    postGeometry(polygonData).then(function (res) {
                        polygonData = {};
                        vm.polygon = [];
                        if(res.err){
                            return reject(res.err);
                        }
                        return resolve(res);
                    });
                }
            });
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
            createPoint      : createPoint,
            createLinestring : createLinestring,
            createPolygon    : createPolygon
        }
    });
