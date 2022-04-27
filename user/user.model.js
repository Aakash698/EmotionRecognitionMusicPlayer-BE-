var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    songs: [{
        title: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
            required:true,
        },
        emotion: {
            type: String,
        },
        src: {
            type: String,
            required:true,
        },
        img: {
            type:String,
            required:true,
            
        }
    }, ],
 
}, {
    timestamps: true,
});

const user = mongoose.model("user", userSchema);
module.exports = user;



// passwordResetToken: String,
// passwordResetExpiry: Date,