// Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// Creates a GeoObject Schema. This will be the basis of how data is stored in the db
var markers = new Schema({
    name : {type: String},
    type: {
        type: String,
        default : 'Point'
    },
    coordinates: {type: [Number], index:true},
    created_at:  {type: Date, default: Date.now},
    updated_at:  {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
markers.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
markers.index({coordinates: '2dsphere'});
module.exports = mongoose.model('markers', markers);
