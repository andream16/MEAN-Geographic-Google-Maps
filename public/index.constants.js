
angular
    .module('meanMapApp')
    .constant('VIEWS', {
        'point'      : 'partials/add-points.html',
        'linestring' : 'partials/add-linestrings.html',
        'polygon'    : 'partials/add-polygons.html'
    });