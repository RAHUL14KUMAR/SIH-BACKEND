const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userSchema");
const complaint=require("../models/complaintSchema");

const register = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Enter all details");
  }
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already Exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    name,
    email,
    type: 'user',
    password: hashedPass,
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateJwt(user._id),
  });
});

const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Enter all details");
  }
  const user = await userModel.findOne({
    email,
  });
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      type: 'user',
      token: generateJwt(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Wrong credentials");
  }
});

const launchComplaint=expressAsyncHandler(async(req,res)=>{
    const {state,city,district,to,complaintType,description,image}=req.body;

    const { name, email, _id } = req.user;
    try{
        const complainer=await userModel.findOne({email:email});
        
        if (!description|| !image|| !state|| !city|| !district|| !to) {
            res.status(400);
            throw new Error("Enter all details");
        }
        const complain=await complaint.create({
            state,city,district,to,complaintType,description,image,complaintBy:email
        })
        console.log(complain.id);

        console.log("complainer",complainer);
        if(complainer){
            complainer.complaints.push(complain.id);
        }
        await complainer.save();

        res.status(200).json({
            _id:complain.id,
            state:complain.state,
            city:complain.city,
            district:complain.district,
            to:complain.to,
            type:complain.complaintType,
            description:complain.description,
            image:complain.image,
            By:complain.complaintBy
        })

    }catch(error){
        res.status(500).json(error);
    }
})

const getMe = expressAsyncHandler(async (req, res) => {
    const { name, email, _id,complaints} = req.user;
    const complain=await complaint.find({complaintBy:email});
    console.log(complain);
    res.status(200).json({
      id: _id,
      name,
      type: 'user',
      email,
      complaints,
      complain:complain
    });
  });

const generateJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

module.exports = {
  login,
  register,
  launchComplaint,
  getMe
};
