const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema=new Schema({
    state:{
        type:String  
    },
    city:{
        type:String
    },
    district:{
        type:String
    },
    to:{
        type:String
    },
    complaintType:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    complaintBy:{
        type:String 
    },
    isSolved:{
        type:Boolean,
        default:false
    },
    },{ 
        timeStamps: true
});

module.exports=mongoose.model("complaints",complaintSchema);