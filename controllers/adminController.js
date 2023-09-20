const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const adminModel = require("../models/adminSchema");
const complaint=require("../models/complaintSchema");

const registerAdmin = expressAsyncHandler(async (req, res) => {
    const { name, email, password,state,city,district,governmentProof } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Enter all details");
    }
    const userExists = await adminModel.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("Admin already Exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
  
    const user = await adminModel.create({
      name,
      email,
      type: 'admin',
      password: hashedPass,
      state,city,district,governmentProof
    });
  
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      state:user.state,
      city:user.city,
      district:user.district,
      token: generateJwt(user._id),
    });
});
  

const loginAdmin = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Enter all details");
    }
    const user = await adminModel.findOne({
      email,
    });
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        type: 'admin',
        state:user.state,
        city:user.city,
        district:user.district,
        token: generateJwt(user.id),
      });
    } else {
      res.status(400);
      throw new Error("Wrong credentials");
    }
});

const complaintGoToAdmin=expressAsyncHandler(async(req,res)=>{
    try{
        const { name,state,city} = req.user;
        const complain=await complaint.find({isSolved:false,state:state});
        if(complain&&complain.length>0){
            return res.status(200).json(complain);
        }
        else{
            return res.status(201).json("no complain found on this state");
        }
    }catch(error){
        res.status(500).json(error);
    }
})

const createPathForComplaint=expressAsyncHandler(async(req,res)=>{
    try{
        const complainid=req.params.id;
        const {description,path}=req.body;
        console.log(complainid);

        const complain=await complaint.findById(complainid);

        if(complain){
            complain.adminDescription=description;
            complain.pathToFollow=path;

            await complain.save();

            res.status(200).json("path has been defined");
        }else{
            res.status(404).json("no complain found");
        }
    }catch(error){
        res.status(500).json(error);
    }
})

const getMe = expressAsyncHandler(async (req, res) => {
    const { name, email, _id,state,city,district,governmentProof} = req.user;
    const complain=await complaint.find({complaintBy:email});
    console.log(complain);
    res.status(200).json({
      id: _id,
      name,
      type: 'admin',
      email,state,city,district,governmentProof
    });
});



  const generateJwt = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
  };

  module.exports = {
    loginAdmin,
    registerAdmin,
    getMe,complaintGoToAdmin,
    createPathForComplaint
  };