// import from models

require('dotenv').config()

const async = require('hbs/lib/async');
// imports
const jwt = require('jsonwebtoken')

const {
  User,
  Booking,
  Review,
  ContactUs,
  Property,
} = require("../models/models");


// property route functions =>

// 1
const getAllProperty = (req, res) => {
  Property.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
};

// 2
const getPropertyById = async (req, res) => {
  const propertyById = await Property.findOne({ propertyID: parseInt(req.cookies.tempID)},{_id:0}).lean();
  if (propertyById.userReviews !== null) {
    propertyById.userReviews = await Review.find({propertyID:req.cookies.tempID},{_id:0,userID:0, reviewID:0});
  }
  res.clearCookie("tempID");
  res.status(200).json(propertyById)
};

// 3
const postBooking = async (req, res) => {
    console.log(req.body);
  let tempId;
  if ((await Booking.count({})) === 0) {
    tempId = 1;
  } else {
    tempId = await Booking.findOne().sort("-_id");
    tempId = tempId.bookingID + 1;
  }
  const booking = new Booking({    
    bookingID: tempId,
    bookingDate: Date.now(),
    userID: req.user.userID,
    propertyID: req.body.propertyID,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
    totalPrice: req.body.totalPrice,
    paymentMethod: req.body.paymentMethod,
    numberOfRooms: req.body.numberOfRooms,
    numberOfNights: req.body.nights,
  });

  booking.save((err, result) => {
    if (err) {
      res.status(404).end()
      console.log(err);
    } else {
      console.log("booking saved");
    }
  });
  res.redirect(`../user/account/${req.user.userName}/dashboard`);
};

//   4


// 5
const getPropertyPage = async (req,res) =>{
  if(req.user){
    res.cookie("tempID",req.params.id)
    const picture =await User.findOne({userID:req.user.userID},{profilePicture:1,_id:0})
    res.render('verifiedproperty',{name:req.user.userName,img:picture.profilePicture})
  }else{
    res.cookie("tempID",req.params.id)
    res.render('property')
  }
}

// 6
const deleteProperty = async (req,res) => {
  if(req.user){
    console.log(req.body.propertyID)
    try {
      await Property.findOneAndDelete({propertyID:req.body.propertyID});
      res.status(200).json({status:"property deleted"})
    } catch (error) {
      res.status(500).end()
    }
  } else {
    res.status(401).end()
  }
}

// export
module.exports = { getAllProperty, getPropertyById, postBooking, getPropertyPage, deleteProperty};
