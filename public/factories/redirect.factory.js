(function () {
    'use strict';

    /** Used to change partial view in Query View **/
    angular
        .module('meanMapApp')
        .factory('RedirectFactory', function ($http) {

            var vm             = this;
            vm.queryConfigPath = './config/query-view-url.config.json';
            vm.mapConfigPath   = './config/map-view-url.config.json';

            /** Parses url: Area Intersection => area-intersection **/
            function parseUrl(url) {
                return new Promise( function (resolve) {
                    vm.parsedUrl = url.toLowerCase().split(' ').join('-');
                    return resolve({'template' : vm.parsedUrl});
                });
            }

            /** Gets Config Json **/
            function getConfig (path) {
                return new Promise( function (resolve) {
                    return resolve($http.get(path).then( function (response) {
                        return response.data;
                    }));
                });
            }

            /** Parses the url, checks if it is contained in json.config then returns correct template.url **/
            function goTo(url) {
                return new Promise( function (resolve) {
                    parseUrl(url).then( function (parsedUrl) {
                        getConfig(vm.queryConfigPath).then( function (config) {
                            if(parsedUrl.template in config.template){
                                return resolve(config.template[parsedUrl.template]);
                            }
                        })
                    })
                });
            }

            /** Parses the url, checks if it is contained in json.config then returns correct template.url **/
            function goToMap(url) {
                return new Promise( function (resolve) {
                    parseUrl(url).then( function (parsedUrl) {
                        getConfig(vm.mapConfigPath).then( function (config) {
                            if(parsedUrl.template in config.template){
                                return resolve(config.template[parsedUrl.template]);
                            }
                        })
                    })
                });
            }

            /** Exposing goTo function **/
            return {
                goTo    : goTo,
                goToMap : goToMap
            }
        });

})();


