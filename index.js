const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

const PORT=process.env.PORT || 3000;

const app=express();   // Call the Function and app gets the all method those we will be needed 

//Connect with the database
mongoose.connect('mongodb://127.0.0.1:27017/AirBnBClone')

// 2. Property Listing 

//      (property ID,Name of the property, Owner of the property,{city,state,country}, Pricing,
//     Size/Area in Square feet/meter, Rating,Images 2 Type{Profile Image,Gallery Images(4)}, No Of BEdrooms, 
//        No of bathroomsAnd BEds, Number of people Allowed,
//      Detailed Description, Aminities(Parking,Wi-fi,BreakFast,AC,TV,Londry,Freez,Kitchen, Smoke Alarm, Pets Allowed Or not),
//      Property TAgs

// Create A schema!
const propertyListing={
    property_id:{
        type: Number,
        unique: true
    },
    name:String,
    owner:String,
    city:String,
    state:String,
    country:String,
    pricing:String,
    area: Number,
    rating:Number,
    images:String,
    bedRooms:Number
}

// PropertListBP=Properties 
const Properties =mongoose.model('PropertiesList', propertyListing)
//This .model() accepts the following two parameters: Collection name: It is the name of the collection. Collection Schema: It is the schema of the collection.


app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/views/index.html")
})

// app.get('/fetchDetail',()=>{

// })

app.listen(PORT,()=>{
    console.log(`Server Started at port - ${PORT}`);
})






// {
//     property_id:{
//         type:105,
//         unique: true
//     },
//     name:"Banglow1",
//     owner:"Cotrell",
//     city:"Kolkata",
//     state:"West Bengal",
//     country:"India",
//     pricing:5000,
//     area: 400,
//     rating:4.5,
//     images:"https://www.shutterstock.com/image-photo/swimming-pool-area-bar-luxury-600w-1033373791.jpg",
//     bedRooms:5
// }