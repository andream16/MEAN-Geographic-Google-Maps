var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// Creates a Polygon Schema.
var polygons = new Schema({
    name: {type: String, required : true},
    geo : {
        type : {type: String,
            default: "Polygon"},
        coordinates : Array
    },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
polygons.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

polygons.index({geo : '2dsphere'});
module.exports = mongoose.model('polygons', polygons);
