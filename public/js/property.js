const main_feed_container = document.getElementById("main_feed_container");
const propertyDiv = document.getElementById("property_div");
const user_info = document.querySelector("#user_info");
let checkOutDiv;
let checkInDiv;
let noOfRooms;
let priceDiv;
let noOfNights;
let totalPrice;
let bookBtn;
let pricePerNight = 0;

const addEventToBookingForm = () => {
// function for calculating price and days 
  const calcBookingData = () => {
    // bookBtn.style.visibility = "hidden";
    bookBtn.classList.add('hidden')
      let date1 = new Date(checkInDiv.value);
      let date2 = new Date(checkOutDiv.value);
      let diff =
      Math.round(date2.getTime() - date1.getTime()) / (60 * 60 * 24 * 1000);
      let rooms = noOfRooms.value;
      console.log(typeof rooms)
      if (rooms>=noOfRooms.min && rooms <= noOfRooms.max) {
        noOfNights.value = diff;
      totalPrice.value = diff * pricePerNight * rooms;
      priceDiv.innerHTML =`<p><span>No of days:</span><span>${diff} Days</span></p>
      <p><span>No. of rooms:</span><span>${rooms} Rooms</span></p>
      <p><span>Total price:</span><span>₹${
        diff * pricePerNight * rooms
      }</span></p>`;
        // bookBtn.style.visibility = "visible";
        bookBtn.classList.remove('hidden')
      }
      else if (rooms == "") {
        priceDiv.innerHTML = ""
      }
      else if (rooms == 0) {
        priceDiv.innerHTML = `<span id="book-form-alert" class="text-danger">Please select atleast 1 room.</span>`
      }
      else{
        priceDiv.innerHTML = `<span id="book-form-alert" class="text-danger">Max rooms available is ${noOfRooms.max}.<br> Please enter again.</span>`
      }
  }

  // to set min check out date
  checkInDiv.addEventListener('input',() => {
    let tempDate = new Date(new Date(checkInDiv.value).getTime() + (60 * 60 * 24 * 1000)).toISOString().slice(0,10);
    console.log(tempDate)
    checkOutDiv.setAttribute('min',`${tempDate}`)
    if (priceDiv.innerHTML !== "") {
      calcBookingData();
    }
  })
  // to set max check in date in case user inputs checkout date first 
  checkOutDiv.addEventListener('input',() => {
    let tempDate = new Date(new Date(checkOutDiv.value).getTime() - (60 * 60 * 24 * 1000)).toISOString().slice(0,10);
    console.log(tempDate)
    checkInDiv.setAttribute('max',`${tempDate}`)
    if (priceDiv.innerHTML !== "") {
      calcBookingData();
    }
  })

  noOfRooms.addEventListener("input", calcBookingData);
};


const expandReview = () => {
  document.getElementById('reviews-container-wrapper').style.maxHeight = '100%';
  toggleHide(document.getElementById("reviews-bottom-fade"))
}

// rendering property 
const fetchPropertyById = async () => {
  try {
    const url = `http://localhost:3000/property/fetchproperty`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    //   while (main_feed_container.firstChild) {
    //     main_feed_container.removeChild(main_feed_container.firstChild);
    //     note:- we could also use main_feed_container.innerHTML=""; but not recommended
    //             because it doesn't remove event listeners and leads to memory leak
    //   }

    // creating amenities section
    let amenitiesNode = ``;
    function getAmenities() {
      for (let keys in data.amenities) {
        if (data.amenities[keys] == true) {
          function iconSelector(keys) {
            switch (keys) {
              case "Parking":
                return "garage_home";
                break;
              case "Breakfast":
                return "brunch_dining";
                break;
              case "AC":
                return "heat_pump";
                break;
              case "TV":
                return "live_tv";
                break;
              case "Fridge":
                return "kitchen";
                break;
              case "Laundry":
                return "local_laundry_service";
                break;
              case "Kitchen":
                return "cooking";
                break;
              case "Smoke Alarm":
                return "detector_smoke";
                break;
              case "Pets Allowed":
                return "pets";
                break;
              case "WiFi":
                return "wifi";
                break;
              default:
                return "check_box";
                break;
            }
          }
          amenitiesNode += `<p><span class="material-symbols-outlined">
              ${iconSelector(keys)}
              </span>${keys}</p>`;
        }
      }
      return amenitiesNode;
    }

    // show or hide faded div 
    let showFadedBottom = false;
    const showFade = () => {
      console.log(showFadedBottom)
      if (showFadedBottom) {
        return "bottom-fade";
      }
      else{
        return "bottom-fade hidden";
      }
    }
    // render all reviews  
    let userReviews = ``;
    function getReviews() {
      if (data.reviews == 0) {
        return (userReviews = `<p>No reviews yet.</p>`);
      } else {
        showFadedBottom = true;
        let reviewNode = ``;
        data.userReviews.forEach((review) => {
          userReviews += `<div class="single-review-wrapper">
              <div class="reviewer-details-wrapper">
                <div>
                  <div class="reviewer-img" style="background-image:url('http://localhost:3000/fetchImage/${review.reviewerImg}')"></div>
                  <span>${review.reviewerName}</span><span>${new Date(review.reviewDate)
                    .toGMTString()
                    .slice(8, 16)}</span></div>
                  <div class="review-rating-container"><span class="star-icon material-symbols-outlined">star</span>
                      <span>${review.rating}</span>
                  </div>
              </div>
              <div>
                  <h5>${review.heading}</h5>
                  <p>
                      ${review.description}
                  </p>
              </div>
          </div>`;
        });
        return userReviews;
      }
    }

    let bookingFormNode = ``;
    function renderBookingForm() {
      if (user_info.innerHTML == "Become a host") {
        bookingFormNode = `<input type="button" value="Sign in to book property" class="btn" id="book-signin-btn" onclick="showLoginPage()">`;
        return bookingFormNode;
      } else {
        bookingFormNode = `<form action="http://localhost:3000/property/booking" method="post" id="booking-form">
              <div class="mb-3" id="date-input-wrapper">
              <div>
              <label for="checkInDate" class="form-label">Check-in Date:</label><br>
              <input type="date" class="form-control" id="checkInDate" name="checkInDate" max="" min="${new Date(Date.now()).toISOString().slice(0,10)}" required>
              </div>
              <div>
              <label for="checkOutDate" class="form-label">Check-out Date:</label><br>
              <input type="date" class="form-control" id="checkOutDate" name="checkOutDate" min="" required>
              </div>
              </div>
              <div class="mb-3">
                <label for="numberOfRooms" class="form-label">Number of rooms:</label>
                <input type="number" class="form-control" id="numberOfRooms" name="numberOfRooms" placeholder="Max. room available is ${data.bedroom}" min="1" max="${data.bedroom}" required>
              </div>
              
              <div class="mb-3 hidden" id="bookingPrice">
              <input type="number" class="form-control" id="nights" name="nights">
              <input type="number" class="form-control" id="totalPrice" name="totalPrice">
              <input type="number" class="form-control" name="propertyID" value="${data.propertyID}">
              </div>
              <div class="mb-3">
                <select class="form-select" aria-label="Default select example" name="paymentMethod" id="paymentMethod" required>
              <option selected disabled>Choose Payment Method</option>
              <option value="online">Pay Online</option>
              <option value="cash">Pay in Cash</option>
            </select>
              </div>
              <div className="mb-3" id="showPriceDays"></div>
              <div class="mb-3 book-btn-container">
              <input type="submit" class="btn hidden" id="book-btn" value="Book Now">
              </div>
            </form>`;
        return bookingFormNode;
      }
    }

    let childNode = `
            <div id="property-details-wrapper">
            <div class="row mb-3 gallery-wrapper">
            <h2>${data.propertyName}<span class="material-symbols-outlined favourite-icon">
            favorite
            </span></h2>
            <p>
            <span>
              <span>
                <span class="star-icon material-symbols-outlined">star</span>${data.rating.slice(
                  0,
                  3
                )}
              </span>
              <span>
                ${data.reviews} reviews
              </span>
            </span>
            <span>${data.city}, ${data.country}</span>  
            </p>
            <div class="col-12 mx-auto gallery-main-img-container">
            <div>
            <img src="http://localhost:3000/fetchImage/${
              data.images[0]
            }" alt="profile img" id="gallery_main_img">
            </div>
            <div class="gallery_img_wrapper">
            
            <div class="gallery-img-container"><img class="gallery-img" src="http://localhost:3000/fetchImage/${
              data.images[1]
            }" alt="profile img"></div>
            <div class="gallery-img-container"><img class="gallery-img" src="http://localhost:3000/fetchImage/${
              data.images[2]
            }" alt="profile img"></div>
            <div class="gallery-img-container"><img class="gallery-img" src="http://localhost:3000/fetchImage/${
              data.images[3]
            }" alt="profile img"></div>
            <div class="gallery-img-container"><img class="gallery-img" src="http://localhost:3000/fetchImage/${
              data.images[4]
            }" alt="profile img"></div>
            
            </div>
            </div>
        </div>
    
        <div class="row mb-3 ">
        <div class="col-md-7 mx-auto container-fluid" id="details-wrapper">
    
        <div class="meta-detail-wrapper">
        <h3 id="profile-img-header"><span>Hosted by <span id="owner-name">${
          data.owner
        }</span></span><img class="user-profile-img" src="https://www.freecodecamp.org/news/content/images/2021/03/Quincy-Larson-photo.jpg" alt=""></h3>
        <p>
        <span>${data.size} sq.ft.</span>
        <span>${data.maxGuests} guests</span>
        <span>${data.bedroom} bedroom</span>
        <span>${data.bathroom} bathroom</span></p>
        </div>
    
        <div class="meta-detail-wrapper">
        <h3>More about us</h3>
        <p>${data.description}</p>
        </div>
    
        <div class="meta-detail-wrapper">
        <h3>What this place offers</h3>
        <div id="amenities-container">
        ${getAmenities()}
        </div>
        </div>
        
        <div id="reviews-container-wrapper" class="meta-detail-wrapper">
        <h3>User Reviews</h3>
        <div id="reviews-container">
        ${getReviews()}
        </div>
        <div id="reviews-bottom-fade" class=${showFade()}  onclick="expandReview()"><span class="material-symbols-outlined">
        expand_more
        </span></div>
        </div>

            </div>
    
            <div class="col-md-5 mx-auto container-fluid" id="booking-form-wrapper">
            <div class="mb-3">
            <h3>Book your holiday NOW</h3></div>
            <div class="mb-3 booking-form-container container">
            <h5>₹ ${data.price} night</h5>
            ${renderBookingForm()}
            </div>
  
            </div>
        </div>
            </div>
            `;
    const childNodeFragment = document
      .createRange()
      .createContextualFragment(childNode);
    main_feed_container.appendChild(childNodeFragment);
    pricePerNight = data.price;
    checkInDiv = document.querySelector("#checkInDate");
    checkOutDiv = document.querySelector("#checkOutDate");
    noOfRooms = document.getElementById("numberOfRooms");
    priceDiv = document.getElementById("showPriceDays");
    noOfNights = document.querySelector("#nights");
    totalPrice = document.querySelector("#totalPrice");
    bookBtn = document.getElementById('book-btn')
      addEventToBookingForm();
  } catch (error) {
    console.log(error);
  }
};

window.onload = fetchPropertyById();
