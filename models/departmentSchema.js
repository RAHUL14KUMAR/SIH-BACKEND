const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema=new Schema({
    departmentName: {
        type: String,
    },
    email: {
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
    handleBy:{
        type:String
    }
},  { 
    timeStamps: true 
})
module.exports = mongoose.model("departments", departmentSchema);