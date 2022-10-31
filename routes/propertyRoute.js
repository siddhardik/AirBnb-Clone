// imports
const express = require('express')
const bodyParser = require('body-parser')
// Note:- sequence of how we require modules is important here  
//        i.e., if this is imported before importing express, the code won't work.
const {getAllProperty, getPropertyById, postBooking, postReview, getPropertyPage, deleteProperty}=require('../controllers/propertyController');  
const { validateJWT } = require('../auth.js');


// express router 
const router = express.Router();


// middlewares 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// routes =>

// get all property api
router.get('/all', getAllProperty);

// get property by id api
router.get('/id/:id',validateJWT, getPropertyPage);

router.get('/fetchproperty',validateJWT, getPropertyById)

// booking request route
router.post("/booking",validateJWT, postBooking);
  
// delete property 
router.post("/delete",validateJWT, deleteProperty);

// export 
module.exports = router;