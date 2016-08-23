var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// Creates a LineString Schema.
var linestrings = new Schema({
    name: {type: String, required : true},
    geo : {
        type : {type: String, default: "LineString"},
        coordinates : Array
    },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
linestrings.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

linestrings.index({geo : '2dsphere'});
module.exports = mongoose.model('linestrings', linestrings);
