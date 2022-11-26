const multer = require("multer");
const Datauriparser = require("datauri/parser");
const path = require("path");

// multer code

const storage = multer.memoryStorage();

// /**
//  * @description This function converts the buffer to data url
//  * @param {Object} req containing the field object
//  * @returns {String} The data url from the string buffer
//  */
const dUri = new Datauriparser();
const dataUri = (img) => {
  return dUri.format(path.extname(img.originalname).toString(), img.buffer);
};

// let tempStore = "./upload";
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, tempStore);
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     cb(
//       null,
//       Date.now() +
//         path.parse(file.originalname).name +
//         path.extname(file.originalname)
//     );
//   },
// });
const upload = multer({ storage: storage });

module.exports = { upload, dataUri };
