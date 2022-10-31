require("dotenv").config();

// imports
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Collection, Schema } = require("mongoose");
const {
  User,
  Booking,
  Review,
  ContactUs,
  Property,
} = require("../models/models");
const e = require("express");

// user route request functions =>

// 1
const postUserSignup = async (req, res) => {
  try {
    // let idCount = await User.count({});
    let tempId;
    // checking if number of documents inside Collection is 0
    if ((await User.count({})) === 0) {
      tempId = 1;
    } else {
      // getting the last inserted document
      tempId = await User.findOne().sort("-_id");
      tempId = tempId.userID + 1;
    }
    // const salt = await bcrypt.genSalt()

    const hashPassword = await bcrypt.hash(req.body.password, 15);
    const user = new User({
      userID: tempId,
      userName: req.body.username,
      fName: req.body.fName,
      mName: req.body.mName,
      lName: req.body.lName,
      email: req.body.email,
      password: hashPassword,
      Name: req.body.name,
      Mobile: req.body.phone,
      country: req.body.country,
      city: req.body.city,
      gender: req.body.gender,
      profilePicture: req.file.filename,
    });
    await user.save();
    const tokenData = {
      userID: user.userID,
      userType: user.userType,
      userName: user.userName,
      fullName: user.fullName,
    };
    const token = jwt.sign(tokenData, process.env.token_secret_key, {
      // expiresIn: "15m",
    });
    res.cookie("token", token, {
      httpOnly: true,
    });
    // res.status(201).send("user added in database");
    res.status(201).redirect(`/user/account/${user.userName}`);
  } catch (err) {
    res.status(500).send(err);
  }
};

// 2
const postUserLogin = (req, res) => {
  try {
    User.findOne({ userName: req.body.username }, async (err, user) => {
      if (err) {
        res.status(500).render("error500");
      } else {
        // checking "user === null" because findOne returns null if it doesn't find anything
        if (user === null) {
          res.status(401).render("error401");
        } else {
          if (await bcrypt.compare(req.body.password, user.password)) {
            const tokenData = {
              userID: user.userID,
              userType: user.userType,
              userName: user.userName,
              fullName: user.fullName,
            };

            const token = jwt.sign(tokenData, process.env.token_secret_key);
            // res.setHeader('authorization',token)
            res.cookie("token", token, {
              httpOnly: true,
            });
            res.redirect(`/user/account/${user.userName}`);
          } else {
            res.status(401).render("error401");
          }
        }
      }
    });
  } catch (err) {
    res.status(401).render("error401");
  }
};

// 3
const postProperty = async (req, res) => {
  const images = req.files.map((index) => {
    return index.filename;
  });
  let tempId;
  if ((await Property.count({})) === 0) {
    tempId = 1;
  } else {
    tempId = await Property.findOne().sort("-_id");
    tempId = tempId.propertyID + 1;
  }
  const property = new Property({
    propertyID: tempId,
    userID: req.user.userID,
    propertyName: req.body.propertyname,
    propertyType: req.body.propertyType,
    owner: req.user.fullName,
    city: req.body.city,
    country: req.body.country,
    price: req.body.price,
    size: req.body.size,
    rating: "New",
    reviews: 0,
    // ownerImg:await User.findOne({userID:req.user.userID},{profilePicture:1}),
    images: images,
    bedroom: req.body.bedroom,
    bathroom: req.body.bathroom,
    maxGuests: req.body.maxguests,
    description: req.body.description,
    amenities: {
      Parking: req.body.parking,
      WiFi: req.body.wifi,
      Breakfast: req.body.breakfast,
      AC: req.body.ac,
      TV: req.body.tv,
      Fridge: req.body.fridge,
      Laundry: req.body.laundry,
      Kitchen: req.body.kitchen,
      "Smoke Alarm": req.body.smokealarm,
      "Pets Allowed": req.body.pets,
    },
  });
  property.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("property added");
    }
  });
  res.redirect(`../property/id/${property.propertyID}`);
};

// 4
const postContactUs = async (req, res) => {
  let tempId;
  if ((await ContactUs.count({})) === 0) {
    tempId = 1;
  } else {
    tempId = await ContactUs.findOne().sort("-_id");
    tempId = tempId.contactID + 1;
  }
  const contactUs = new ContactUs({
    contactID: tempId,
    userEmail: req.body.email,
    query: req.body.query,
    userName: req.body.name,
    userPhone: req.body.phone,
  });

  contactUs.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("contact us query added");
    }
  });
  res.status(200).render("contactUsAdded");
};

// 5

const getDashboardPage = async (req, res) => {
  // checking if jwt is available
  if (req.user && req.user.userName == req.params.id) {
    const picture = await User.findOne(
      { userID: req.user.userID },
      { profilePicture: 1, _id: 0 }
    );
    res.render("dashboard", {
      name: req.user.userName,
      img: picture.profilePicture,
    });
  } else {
    res.redirect("../home");
  }
};

//6
const getDetails = async (req, res) => {
  try {
    console.log(req.user.userID);
    let data = {
      properties: "",
      bookings: "",
    };

    data.properties = await Property.find({ userID: parseInt(req.user.userID) })
      .then((result) => {
        let tempData = [];
        for (let i = 0; i < result.length; i++) {
          tempData.push({
            propertyID: result[i].propertyID,
            image: result[i].images[Math.floor(Math.random() * 5)],
            propertyName: result[i].propertyName,
            city: result[i].city,
            country: result[i].country,
            rating: result[i].rating,
          });
        }
        return tempData;
      })
      .catch((err) => {
        console.log(err);
        return "";
      });

    // Note :- using lean method here to get docs returned from query as pure objects
    // otherwise will have to use
    // let temp = JSON.parse(JSON.stringify(result[i]));
    // or toObject() method or {strict:false} in Schema
    // in order to add a new property to returned query doc

    data.bookings = await Booking.find(
      { userID: parseInt(req.user.userID) },
      { _id: 0, __v: 0, userID: 0 }
    )
      .lean()
      .then(async (result) => {
        for (let i = 0; i < result.length; i++) {
          // creating new properties in bookings object
          result[i].image = "";
          try {
            result[i].propertyName = await Property.findOne(
              { propertyID: result[i].propertyID },
              { propertyName: 1, _id: 0, images: 1 }
            ).then((property) => {
              result[i].image = property.images[Math.floor(Math.random() * 5)];
              return property.propertyName;
            });
          } catch (error) {
            result[i].propertyName = "Property doesn't exist!";
            result[i].image = "#";
          }
        }
        return result;
      })
      .catch((err) => {
        console.log(err);
        return "";
      });

    res.json(data);
  } catch (err) {
    res.status(401).end(err);
  }
};

// 7
const getUserAccount = async (req, res) => {
  if (req.user && req.user.userName === req.params.id) {
    const user = await User.findOne(
      { userID: req.user.userID },
      { profilePicture: 1, email: 1, Mobile: 1, _id: 0 }
    );
    res.render("userdashboard", {
      name: req.user.userName,
      img: user.profilePicture,
      email: user.email,
      phone: user.Mobile,
    });
  } else {
    res.status(500).end();
  }
};

// 8
const postReview = async (req, res) => {
  try {
    let tempId;
    if ((await Review.count({})) === 0) {
      tempId = 1;
    } else {
      tempId = await Review.findOne().sort("-_id");
      tempId = tempId.reviewID + 1;
    }
    const review = new Review({
      reviewID: tempId,
      heading: req.body.heading,
      rating: req.body.rating,
      description: req.body.description,
      userID: req.user.userID,
      reviewDate: Date.now(),
      reviewerName: req.user.fullName,
      reviewerImg: await User.findOne(
        { userID: req.user.userID },
        { profilePicture: 1 }
      ).then((user) => user.profilePicture),
      propertyID: req.body.propertyID,
      bookingID: req.body.bookingID,
    });
    await review.save();
    res.status(200).redirect(`./account/${req.user.userName}/dashboard`);
  } catch (error) {
    console.log(error);
  }
};

// cancel booking
const cancelBooking = async (req, res) => {
  console.log("trying to cancel");
  console.log("cancel", req.body.bookingID);
  try {
    await Booking.findOneAndDelete({ bookingID: req.body.bookingID });
    console.log("deleted");
    // res.status(200).redirect(`./account/${req.user.userName}/dashboard`);
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

// user update function

const userUpdate = async (req, res) => {
  try {
    if (req.user) {
      await User.findOne({ userID: req.user.userID }).then(async (profile) => {
        if (await bcrypt.compare(req.body.password, profile.password)) {
          if (req.body.email) {
            profile.email = req.body.email;
          }
          if (req.body.phone) {
            profile.Mobile = req.body.phone;
          }
          if (req.body.npassword) {
            const hashPassword = await bcrypt.hash(req.body.npassword, 15);
            profile.password = hashPassword;
          }
          await profile.save();
          // res.status(200).redirect(`./account/${req.user.userName}/dashboard`);
          res.status(200).json({status:"updated"})
        } else {
          // console.log(req.body);
          res.status(401).json({ status: "wrong ps !" });
        }
      });
    }
  } catch (error) {
    res.status(401).json({ status: "Unauthorised request !" });
  }
};

// export
module.exports = {
  postUserSignup,
  postUserLogin,
  postProperty,
  postContactUs,
  getDashboardPage,
  getDetails,
  getUserAccount,
  postReview,
  cancelBooking,
  userUpdate,
};
