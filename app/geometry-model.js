var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// Creates a Location Schema.
var GeometrySchema = new Schema({
                                    name: {type: String, required: true},
                                    location: {
                                      type: {type : String, required: true},
                                      coordinates : [Schema.Types.Mixed]
                                    },
                                    created_at: {type: Date, default: Date.now},
                                    updated_at: {type: Date, default: Date.now}
});

GeometrySchema.index({location: '2dsphere'});
module.exports = mongoose.model('geometry', GeometrySchema);
