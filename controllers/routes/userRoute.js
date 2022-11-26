// note:- in mvc we use bodyparser and cookieParser here in routes and not in controllers
// because these are middlewares executed before functions related to get,post and others
// are executed

// imports
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { upload } = require("../middlewares/multerConfig");

// creating an express router
const router = express.Router();

// importing functions from controller
const {
  postUserSignup,
  postUserLogin,
  postProperty,
  postReview,
  postContactUs,
  getDashboardPage,
  getDetails,
  getUserAccount,
  cancelBooking,
  userUpdate,
} = require("../controllers/userController");
const { validateJWT } = require("../auth.js");

// middlewares
// const {
//   cloudinaryConfig,
//   cloudinary,
// } = require("../middlewares/cloudinaryConfig");
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// router.use("*", cloudinaryConfig);
const { request } = require("https");

// defining routes =>

// signup route
router.post("/signup", upload.single("profile_img"), postUserSignup);

// login post route
router.post("/login", postUserLogin);

//render user dashboard page
router.get("/account/:id", validateJWT, getDashboardPage);

//render user account page
router.get("/account/:id/dashboard", validateJWT, getUserAccount);

// user details api
router.get("/details", validateJWT, getDetails);

// register new property route
router.post(
  "/registerproperty",
  validateJWT,
  upload.array("gallery_img", 5),
  postProperty
);

//   contact us route
router.post("/contactus", postContactUs);

// logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  if (!res.cookie.token) {
    res.status(200).json({ status: "success", message: "Logged out" });
  } else {
    res.status(404).end();
  }
});

// add review

router.post("/review", validateJWT, postReview);

// cancel booking
router.post("/booking/cancel", validateJWT, cancelBooking);

// update user
router.post("/update", validateJWT, userUpdate);

// export
module.exports = router;
