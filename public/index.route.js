(function() {
    'use strict';

    angular.module('meanMapApp')
        .config(mainRouterConfig);

    function mainRouterConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('join', {
                url             : '/join',
                templateUrl     : 'partials/add-form.html',
                controller      : 'MapController',
                controllerAs    : 'mapCtrl'
            })
            .state('find', {
                url             : '/find',
                templateUrl     : 'partials/query-form.html',
                controller      : 'QueryController',
                controllerAs    : 'queryCtrl'
            });

        $urlRouterProvider.otherwise('join');
    }

})();