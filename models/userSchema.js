const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema=new Schema({
    name: {
        type: String,
      },
      email: {
        type: String,
      },
      password: {
        type: String,
      },
    },{ 
    timeStamps: true 
})
module.exports = mongoose.model("users", userSchema);