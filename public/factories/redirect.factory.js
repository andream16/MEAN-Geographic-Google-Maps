(function () {
    'use strict';

    /** Used to change partial view in Query View **/
    angular
        .module('meanMapApp')
        .factory('RedirectFactory', function ($http) {

            var vm         = this;
            vm.configPath  = './config/query-view-url.config.json';

            /** Parses url: Area Intersection => area-intersection **/
            function parseUrl(url) {
                return new Promise( function (resolve, reject) {
                    vm.parsedUrl = url.toLowerCase().split(' ').join('-');
                    return resolve({'template' : vm.parsedUrl});
                }, function (error){
                    return reject(error);
                });
            }

            /** Gets Config Json **/
            function getConfig (path) {
                return new Promise( function (resolve, reject) {
                    return resolve($http.get(path).then( function (response) {
                        return response.data;
                    }));
                }, function (error){
                   return reject(error);
                });
            }

            /** Parses the url, checks if it is contained in json.config then returns correct template.url **/
            function goTo(url) {
                return new Promise( function (resolve, reject) {
                    parseUrl(url).then( function (parsedUrl) {
                        getConfig(vm.configPath).then( function (config) {
                            if(parsedUrl.template in config.template){
                                return resolve(config.template[parsedUrl.template]);
                            }
                        })
                    })
                }, function (error){
                   return reject(error);
                });

            }

            /** Exposing goTo function **/
            return {
                goTo : goTo
            }
        });

})();


