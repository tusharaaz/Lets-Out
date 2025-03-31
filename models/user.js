const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
    
});

userSchema.plugin(passportLocalMongoose); // adds username and password fields to the schema and also adds methods to the schema for authentication
module.exports = mongoose.model("User", userSchema);

