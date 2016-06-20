// Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var GeoJSON  = require('geojson');
var Schema   = mongoose.Schema;

// Creates a Location Schema. This will be the basis of how user data is stored in the db
var LocationSchema = new Schema({
                                    name: {type: String, required: true},
                                    location: {
                                      type: {type : String, required: true},
                                      coordinates : [Schema.Types.Mixed]
                                    },
                                    created_at: {type: Date, default: Date.now},
                                    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
LocationSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
LocationSchema.index({location: '2dsphere'});

module.exports = mongoose.model('mean-locations', LocationSchema);
