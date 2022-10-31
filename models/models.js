const async = require('hbs/lib/async');
const mongoose = require('mongoose')

// url 
const mongoURI = "mongodb://127.0.0.1:27017/airbnb";

// connecting to mongoDB
mongoose.connect(mongoURI).then(res => console.log('db connected')).catch(err => console.log(err))

// user schema 
const userSchema = new mongoose.Schema({
    userID:{type:Number,required: true},
    userType:String,
    userName:String,
    fName:String,
    mName: String,
    lName: String,
    fullName: String,
    email:String,
    password:String,
    Name:String,
    Mobile:Number,
    country:String,
    city:String,
    gender:String,
    profilePicture:String,
    favourites:[Number]
})

// property schema 
const propertySchema = new mongoose.Schema({
    propertyID:{type:Number,required: true},
    propertyName:String,
    propertyType: String,
    owner:String,
    ownerImg:String,
    userID:{type:Number,required: true},
    city:String,
    country:String,
    price:Number,
    size:String,
    rating:String,
    images:[String],
    bedroom:Number,
    bathroom:Number,
    maxGuests:Number,
    description:String,
    amenities:{
        Parking:Boolean,
        WiFi:Boolean,
        Breakfast:Boolean,
        AC:Boolean,
        TV:Boolean,
        Fridge:Boolean,
        Laundry:Boolean,
        Kitchen:Boolean,
        "Smoke Alarm":Boolean,
        "Pets Allowed":Boolean
    },
    reviews:Number
})

// booking schema 
const bookingSchema = new mongoose.Schema({
    bookingID:{type:Number,required: true},
    bookingDate: Date,
    userID:{type:Number,required: true},
    propertyID:{type:Number,required: true},
    reviewStatus: Boolean,
    checkInDate:Date,
    checkOutDate:Date,
    totalPrice:Number,
    paymentMethod:String,
    numberOfRooms:Number,
    numberOfNights:Number
})

//  review schema 
const reviewSchema = new mongoose.Schema({
    reviewID:{type:Number,required: true},
    heading:String,
    userID:{type:Number,required: true},
    propertyID:{type:Number,required: true},
    bookingID:{type:Number,required: true},
    reviewerName:String,
    reviewerImg:String,
    reviewDate:Date,
    rating:Number,
    description:String
})

// contact us schema 
const contactUsSchema = new mongoose.Schema({
    contactID:{type:Number,required: true},
    userEmail:String,
    query:String,
    userName:String,
    userPhone:Number
})

// mongoose hooks 
userSchema.pre('save', function (next) {
    // adding full name to every new user's data 
    if (this.isNew) {
        this.userType = 'user';
        let fname = this.fName.trim().toLowerCase();
        this.fName = fname.charAt(0).toUpperCase() + fname.slice(1);
        
        if (this.mName !== undefined) {
            let mname = this.mName.trim().toLowerCase();
            this.mName = mname.charAt(0).toUpperCase() + mname.slice(1);
            }
            let lname = this.lName.trim().toLowerCase();
            this.lName = lname.charAt(0).toUpperCase() + lname.slice(1);

        if (this.mName !== undefined) {
            this.fullName = `${this.fName} ${this.mName} ${this.lName}`
        } else {
            this.fullName = `${this.fName} ${this.lName}`
        }
        }
    next();
})

bookingSchema.pre('save',function (next) {
    // setting review status to false by default 
    if (this.isNew) {
        this.reviewStatus = false;
    }
    next();
})

reviewSchema.post('save',async function () {
    // calculating property rating 
    let propertyReviewed = await Property.findOne({propertyID:this.propertyID});
    propertyReviewed.reviews++;
    propertyReviewed.rating = ((propertyReviewed.rating == 'New' ? 0 : parseFloat(propertyReviewed.rating))*(propertyReviewed.reviews - 1)+this.rating) / propertyReviewed.reviews;
    await propertyReviewed.save();

    // changing review status of booking 
    let booking = await Booking.findOne({bookingID: this.bookingID});
    booking.reviewStatus = true;
    await booking.save();
})

propertySchema.post('save',async function () {
    // changing user type to host on property registration
    if (this.isNew) {
        let owner = await User.findOne({userID: this.userID},{userType:1})
        if (owner.userType === "user") {
            owner.userType = "host";
            await owner.save();
        }
    }
})

propertySchema.pre('findOneAndDelete',async function (next) {
    console.log(this.propertyID);
    const property = await Property.findOne(this.getQuery());
    console.log(property.propertyID)
    try {
        await Booking.updateMany({propertyID:property.propertyID},{"$set":{propertyID:null}},(err,docs)=> {
            if(err) {
                console.log(err)
            }else{
                console.log('Updated Booking:', docs)
            }
        });
    } catch (error) {
        console.log("No bookings found")
    }

    try {
        await Review.updateMany({propertyID:property.propertyID},{"$set":{propertyID:null}},(err,docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Updated reviews:", docs)
            }
        });
    } catch (error) {
        console.log("No reviews found")
    }

    next();
})

// creating models
const User = mongoose.model('user',userSchema);
const Property = mongoose.model('propertie',propertySchema)
const Booking = mongoose.model('booking',bookingSchema)
const Review = mongoose.model('review',reviewSchema)
const ContactUs = mongoose.model('contactuslist',contactUsSchema)


// export 
module.exports = {User,Property,Booking,Review,ContactUs};
