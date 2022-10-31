require('dotenv').config()
// imports
const jwt = require('jsonwebtoken')
const express = require("express");
const path = require("path");
const userRoute = require("./routes/userRoute");
const propertyRoute = require("./routes/propertyRoute");
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const {validateJWT} = require('./auth')
const cors = require('cors')

// express app instance 
const app = express();
app.use(cors({origin:'*'}))
app.use(cookieParser())
// static path, if undefined, app won't know the path to static content like css
const root_path = path.join(__dirname, "./public/");
console.log(root_path);
app.use(express.static(root_path));

const partials_path = path.join(__dirname,"./templates/partials")
const views_path = path.join(__dirname,"./templates/views")
console.log(partials_path);
// middlewares =>
app.use("/user", userRoute);
app.use("/property", propertyRoute);
app.set('view engine','hbs');
hbs.registerPartials(partials_path)
app.set('views',views_path);



// port 
const port = process.env.PORT || '3000';


// routes =>

// homepage 
app.get("/",validateJWT, async (req, res) => {
  // res.sendFile(root_path + "index.html");
  try {
      res.redirect(`/user/account/${req.user.userName}`)
  } catch (error) {
    res.redirect('/home')
}
});

app.get('/home',(req,res)=>{
  res.render('index')
})

app.get('/fetchImage/:id',(req,res)=>{
  if (req.params.id === "#") {
    res.status(404).end();
  } else {
    res.sendFile(__dirname + `/upload/${req.params.id}`)
  }
})

// listening to port
app.listen(port, () => console.log("server started at port 3000"));
