const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        unique : true,
        required : true,
    },
    password : { 
        type: String,
        required : true,
    },
    picture : {
        type : String,
        default : "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Free-Download.png"
    }
},
{
    timestamps: true,
})

userModel.methods.matchPassword = async function(enterd){
    return await bcrypt.compare(enterd, this.password);
}

userModel.pre("save", async function(next){
    if(!this.isModified){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})


const User = mongoose.model("User", userModel);

module.exports = User;