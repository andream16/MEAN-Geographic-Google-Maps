
var Linestrings  = require('../models/linestring-model.js');

exports.getLinestrings = getLinestrings;
exports.postLinestring = postLinestring;

/** Gets all the linestrings stored in the DB **/
function getLinestrings() {
    return new Promise( function (resolve, reject) {
        var query = Linestrings.find({});
        query.exec(function(err, linestrings) {
            if (err){
                return reject(err);
            }
            // If no errors are found, it responds with a JSON of all linestrings
            return resolve(linestrings);
        });
    }, function (error){
        return reject(error);
    });
}

/** Posting a new marker **/
function postLinestring(req) {
    // console.log('factory '+JSON.stringify(req.body));
    return new Promise( function (resolve, reject) {
        // Creates a new Linestring based on the Mongoose schema and the post body
        var newLinestring = new Linestrings(req.body);
        // console.log(newLinestring);
        // New Linestring is saved in the db.
        newLinestring.save(function(err) {
            console.log(err);
            if (err){
                return reject(err);
            }
            // If no errors are found, it responds with a JSON of the new linestring
            return resolve(req.body);
        });
    }, function (error){
        return reject(error);
    });
}