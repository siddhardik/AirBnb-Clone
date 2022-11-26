const cloudinary = require("cloudinary");

// const cloudinaryConfig = (req, res, next) => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
//   });
//   next();
// };

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// module.exports = {cloudinaryConfig, cloudinary };
// module.exports = { cloudinary };
