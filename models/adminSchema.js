const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema=new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    state:{
        type:String
    },
    city:{
        type:String,
    },
    district:{
        type:String
    },
    governmentProof:{
        type:String
    }
},  { 
    timeStamps: true 
})
module.exports = mongoose.model("admins", adminSchema);