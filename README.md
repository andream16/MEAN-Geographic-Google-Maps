# MEAN-Geographic-Google-Maps
## DB Project for Data Bases 2 Exam

This project is essentially a fork of  @Ahmed Haque Making MEAN Apps with Google Maps available at https://github.com/afhaque/MeanMapAppV2.0

I made different changes to project's structure and added Polyline and Polygon support with some Geospatial Queries on the latter objects.

###What you need to run the project:
 - Node ~^4.4.7
 - NPM ~^2.15
 - MongoDB ~^3.2.7
 - Bower ~^1.7.9

###How to install bower and npm packages:
 - Go on Project's folder
 - run: `bower install`
 - run: `npm install`

###How to run the project:
 - if you have nodemon: `nodemon server.js`
 - else: `npm start server.js`

###Remember to change `Google-Maps-Key` with yours.

###Example of Geometry Objects

####Point
`{ 
    "name" : "point1",
    "geo" : {
        "coordinates" : [
            52.483, 
            16.084
        ], 
        "type" : "Point"
    }
}`

#####LineString
`{ 
    "name" : "linestring2",
    "geo" : {
        "coordinates" : [
            [
                38.232, 
                38.823
            ], 
            [
                70.576, 
                51.289
            ], 
            [
                91.67, 
                59.801
            ], 
            [
                91.318, 
                68.073
            ]
        ], 
        "type" : "LineString"
    }
}`

####Polygon (it has to be closed -> first point coordinates == last point coordinates)
`{ 
    "name" : "polygon1", 
    "geo" : {
        "coordinates" : [
            [
                [
                    3.779, 
                    9.276
                ], 
                [
                    14.854, 
                    15.115
                ], 
                [
                    38.408, 
                    17.309
                ], 
                [
                    40.693, 
                    7.711
                ], 
                [
                    35.068, 
                    -7.885
                ], 
                [
                    5.889, 
                    -9.622
                ], 
                [
                    1.143, 
                    -3.689
                ], 
                [
                    3.779, 
                    9.276
                ]
            ]
        ], 
        "type" : "Polygon"
    }
}`
