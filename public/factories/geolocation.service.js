(function () {
    'use strict';

    angular
        .module('meanMapApp')
        .service('GeolocationService', function (geolocation) {

            function getCurrentLoc(){
                return new Promise( function (res, rej) {
                    geolocation.getLocation().then(function(data) {
                        var coords = {
                            lat: data.coords.latitude,
                            long: data.coords.longitude
                        };

                        if(coords){
                            return res(coords);
                        }
                        return rej({error : 'Current Coordinates not found'});
                    });
                });

            }

            return {
                getCurrentLoc : getCurrentLoc
            }
        });

})();


