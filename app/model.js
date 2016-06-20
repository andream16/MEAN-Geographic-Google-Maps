// Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var GeoJSON  = require('geojson');
var Schema   = mongoose.Schema;

// Creates a GeoObject Schema. This will be the basis of how data is stored in the db
var geoObjects = new Schema({
                                        name : {type: String},
                                        type: {
                                                  type: String,
                                                  enum: [
                                                            "Point",
                                                            "LineString",
                                                            "Polygon"
                                                          ],
                                                  default : 'Point'
                                                },
                                        coordinates: [Number],
                                        created_at: {type: Date, default: Date.now},
                                        updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
geoObjects.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
geoObjects.index({coordinates: '2dsphere'});

module.exports = mongoose.model('geoObjects', geoObjects);
