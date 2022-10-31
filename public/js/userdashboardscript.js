const editBtn = document.getElementsByClassName("edit-btn");
const submitChange = document.getElementById("submit-changes");
const myPropertyContainer = document.getElementById("my-property-container");
const bookingsContainer = document.getElementById("my-bookings-container");
const editForm = document.getElementById('edit-form');
const abort = document.getElementsByClassName("abort-btn");

// abort button function
Array.from(abort).forEach((btn) => {
  btn.addEventListener("click", () => {
    Array.from(document.querySelector(".modal_container").children).forEach(
      (ele) => {
        if (!ele.classList.contains("hidden")) {
          ele.classList.add("hidden");
        }
      }
    );
    toggleHide(modal_container);
  });
});

// show add review modal
const reviewModal = (p_id, b_id) => {
  toggleHide(modal_container);
  document.getElementById("review_property_id").value = p_id;
  document.getElementById("review_booking_id").value = b_id;
  console.log(document.getElementById("review_property_id").value);
  toggleHide(document.getElementById("review_modal_container"));
};

const openRegistrationModal = () => {
  toggleHide(modal_container);
  toggleHide(registerPropertyModal);
};

// rating event listeners
// and function for adding and removing color from star
let starCounter = -1;
document.querySelectorAll(".star").forEach((star, i, arr) => {
  star.addEventListener("click", () => {
    if (i === starCounter) {
      arr.forEach((ele) => {
        ele.style.color = "#41464b";
      });
      starCounter = -1;
    } else {
      arr.forEach((ele) => {
        ele.style.color = "#41464b";
      });
      arr.forEach((ele, j) => {
        if (j <= i) {
          ele.style.color = "#ff385c";
        }
        starCounter = i;
      });
    }
    document.getElementById("rating").value = i + 1;
  });
});

const setStarColor = () => {
  document
    .querySelectorAll(".star")
    .forEach((star) => (star.style.color = "#41464b"));
};
const getPropertyById = (id) => {
  const url = `http://localhost:3000/property/id/${id}`;
  window.location.href = url;
};

// add review http call
const showAlert = async function (e) {
  submitChange.innerHTML = "Submitting..";
  submitChange.style.backgroundColor = 'gray';
  e.preventDefault();
  let submitBtn = document.getElementById('submit-changes')
  let npassword = document.getElementById('npassword')
  let rpassword = document.getElementById('rpassword')
  if(!document.getElementById("reenter-password").classList.contains('hidden') && npassword.value !== rpassword.value) {
    submitBtn.innerHTML = "Retry";
      submitBtn.style.backgroundColor = 'red';
    rpassword.value = "";
    rpassword.classList.add('errorInputStyle');
    rpassword.setAttribute('placeholder','Password do not match !');
    setTimeout(()=>{
      rpassword.classList.remove('errorInputStyle');
      rpassword.setAttribute('placeholder','Re-enter new password');
    },1800)
    return;
  }
  // NOTE:- FormData uses the same format a form uses while sending multipart/formdata 
  //        so to send formdata as body either specify body as url-encoded string or pass a URLSearchParams object 
  const formData = new URLSearchParams(new FormData(editForm));
  // for (const item of data) {
  //   console.log(item[0],item[1])
  // }
  let response = await fetch(editForm.action, {
    method: "POST",
    body: formData,
  });

  console.log(response);
  const alertDiv = document.getElementById("status_alert_container");
    const alertText = document.getElementById("status-container");
    if (response.status === 200) {
      submitBtn.style.backgroundColor = 'green';
      submitBtn.innerHTML = 'Submitted';
      alertText.innerHTML = "User information updated.";
      alertDiv.style.backgroundColor = "#4BB543";
      toggleHide(alertDiv);
      setTimeout(() => {
        toggleHide(alertDiv);
        window.location.reload(true);
      }, 2000);
    } else if(response.status === 401){
      submitBtn.innerHTML = "Retry";
      submitBtn.style.backgroundColor = 'red';
      let ele = editForm.querySelector('#confirmPassword');
      ele.value = "";
      ele.setAttribute('placeholder','Wrong Password Entered !');
      ele.classList.add('errorInputStyle');
      setTimeout(()=>{
        ele.classList.remove('errorInputStyle');
        ele.setAttribute('placeholder','Enter current password to confirm');
      }, 1800)
    }
};

editForm.addEventListener('submit',showAlert);





const cancelBookingFetch = async (e) => {
  e.preventDefault();
  try {
    const form = document.getElementById("cancel-booking-form");
    let data = {
      bookingID: document.getElementById("confirm-booking-id").value,
    };
    data = JSON.stringify(data);
    console.log(data);
    let response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    console.log(response);
    const alertDiv = document.getElementById("status_alert_container");
    const alertText = document.getElementById("status-container");
    if (response.status === 200) {
      toggleHide(document.getElementById("cancel_booking_modal_container"));
      toggleHide(modal_container);
      alertText.innerHTML = "Booking Cancelled Successfully.";
      alertDiv.style.backgroundColor = "#4BB543";
      toggleHide(alertDiv);
      setTimeout(() => {
        toggleHide(alertDiv);
        getDetails();
      }, 2000);
    } else {
      toggleHide(document.getElementById("cancel_booking_modal_container"));
      toggleHide(modal_container);
      alertText.innerHTML = "Booking Cancellation Unsuccessfull!";
      alertDiv.style.backgroundColor = "#ff385c";
      toggleHide(alertDiv);
      setTimeout(() => toggleHide(alertDiv), 2000);
    }
  } catch (error) {
    const alertDiv = document.getElementById("status_alert_container");
    const alertText = document.getElementById("status-container");
    toggleHide(document.getElementById("cancel_booking_modal_container"));
    toggleHide(modal_container);
    alertText.innerHTML = "Server unresponsive!";
    alertText.style.color = "#ff385c";
    toggleHide(alertDiv);
    setTimeout(() => {
      toggleHide(alertDiv);
    }, 2000);
  }
};

const deletePropertyFetch = async (e) => {
  e.preventDefault();
  try {
    const form = document.getElementById("delete-property-form");
    let data = {
      propertyID: document.getElementById("confirm-property-id").value,
    };
    data = JSON.stringify(data);
    let response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    const alertDiv = document.getElementById("status_alert_container");
    const alertText = document.getElementById("status-container");
    if (response.status === 200) {
      toggleHide(document.getElementById("delete_property_modal_container"));
    toggleHide(modal_container);
      alertText.innerHTML = "Property Removed Successfully.";
      alertDiv.style.backgroundColor = "#4BB543";
      toggleHide(alertDiv);
      setTimeout(() => {
        toggleHide(alertDiv);
        getDetails();
      }, 2000);
    } else {
      toggleHide(document.getElementById("delete_property_modal_container"));
    toggleHide(modal_container);
      alertText.innerHTML = "Unsuccessfull. Please try again!";
      alertDiv.style.backgroundColor = "#ff385c";
      toggleHide(alertDiv);
      setTimeout(() => toggleHide(alertDiv), 2000);
    }
  } catch (error) {
    const alertDiv = document.getElementById("status_alert_container");
    const alertText = document.getElementById("status-container");
    toggleHide(document.getElementById("delete_property_modal_container"));
    toggleHide(modal_container);
    alertText.innerHTML = "Server unresponsive!";
    alertText.style.color = "#ff385c";
    toggleHide(alertDiv);
    setTimeout(() => {
      toggleHide(alertDiv);
    }, 2000);
  }
};

// add Listeners
document
  .getElementById("cancel-confirm-btn")
  .addEventListener("click", cancelBookingFetch);

document
  .getElementById("delete-property-confirm-btn")
  .addEventListener("click", deletePropertyFetch);

// update form edit button event listeners
let counter = 0;
Array.from(editBtn).forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.textContent === "Edit") {
      e.target.textContent = "Cancel";
    } else {
      counter--;
      e.target.textContent = "Edit";
    }
    if (e.target.value === "npassword") {
      document.getElementById("reenter-password").classList.toggle("hidden");
      document.getElementById("rpassword").toggleAttribute("disabled");
    }
    e.target.parentElement.nextElementSibling.toggleAttribute("disabled");

    if (counter === 0) {
      document.getElementById("confirm-password").classList.toggle("hidden");

      submitChange.classList.toggle("hidden");
    }

    if (e.target.textContent === "Cancel") {
      counter++;
    }
  });
});

// delete buttons event listeners
const openDeleteAccountModal = () => {
  toggleHide(modal_container);
  toggleHide(document.getElementById("delete_user_modal_container"));
};

const openConfirmModal = () => {
  Array.from(document.getElementsByClassName("delete_btn")).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.getElementById("confirm-property-id").value = e.target.value;
      toggleHide(modal_container);
      toggleHide(document.getElementById("delete_property_modal_container"));
    });
  });
};

const cancelBooking = (id) => {
  document.getElementById("confirm-booking-id").value = id;
  toggleHide(modal_container);
  toggleHide(document.getElementById("cancel_booking_modal_container"));
};

// function to get user proper and booking details
const getDetails = async () => {
  try {
    const url = `http://localhost:3000/user/details`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (data.properties.length === 0 && !myPropertyContainer.classList.contains('hidden')) {
      document.getElementById("no-property-div").classList.remove('hidden');
      while (myPropertyContainer.firstChild) {
        myPropertyContainer.removeChild(myPropertyContainer.firstChild);
      }
      myPropertyContainer.classList.add('hidden');
    }

    if (data.bookings.length === 0 && !bookingsContainer.classList.contains('hidden')) {
      document.getElementById("no-property-div").classList.remove('hidden');
      while (bookingsContainer.firstChild) {
        bookingsContainer.removeChild(bookingsContainer.firstChild);
      }
      bookingsContainer.classList.add('hidden');
    }

    if (data.properties.length !== 0) {
      document.getElementById("no-property-div").classList.add('hidden');
      myPropertyContainer.classList.remove('hidden');
      while (myPropertyContainer.firstChild) {
        myPropertyContainer.removeChild(myPropertyContainer.firstChild);
      }
      data.properties.forEach((property, i) => {
        const tempData = `<div class="card">
            <div class="card-body" onclick="getPropertyById(${
              property.propertyID
            })">
            <img src="http://localhost:3000/fetchImage/${
              property.image
            }" class="card-img-top" alt="img">
                <h5 class="card-title">${property.propertyName}</h5>
            </div>
            <ul class="list-group">
                <li class="list-group-item"><span>${property.city}, ${
          property.country
        }</span><span><span class="star-icon material-symbols-outlined">
                star
                </span>${property.rating.slice(0, 3)}</span></li>
            </ul>
            <button class="btn btn-danger delete_btn" value="${
              property.propertyID
            }">Delete Property<span data-id="${
          property.propertyID
        }" class="delete-icon material-symbols-outlined">
            delete
            </span></button>
        </div>`;
        const appendData = document
          .createRange()
          .createContextualFragment(tempData);
        myPropertyContainer.appendChild(appendData);
      });
    }
    // function to determine which button to render, cancel or add review
    const btnClass = (name, checkIn, bID, pID, reviewStatus) => {
      if (name !== "Property doesn't exist!") {
        const twoDays = 2 * (24 * 60 * 60 * 1000);
        if (
          new Date(checkIn).getTime() >=
          new Date(Date.now()).getTime() + twoDays
        ) {
          return `<p><button class="btn btn-danger cancel-booking-btn" onclick="cancelBooking(${bID})" value="${bID}">Cancel Booking</button></p>`;
        } else if (
          new Date(checkIn).getTime() >= new Date(Date.now()).getTime() &&
          new Date(checkIn).getTime() < new Date(Date.now()).getTime() + twoDays
        ) {
          return `<p><button class="btn fake-btn">Cancellation Not Allowed</button></p>`;
        } else {
          if (reviewStatus) {
            return `<p><button class="btn fake-btn">Review Added</button></p>`;
          } else {
            return `<p><button class="btn btn-success review-btn" onclick="reviewModal(${pID},${bID})" value="${pID}">Add Review</button></p>`;
          }
        }
      } else {
        return "";
      }
    };

    console.log("bookings");
    if (data.bookings.length !== 0) {
      // toggleHide(document.getElementById("no-booking-div"));
      document.getElementById("no-booking-div").classList.add("hidden");
      // toggleHide(document.getElementById("my-bookings-container"));
      while (bookingsContainer.firstChild) {
        bookingsContainer.removeChild(bookingsContainer.firstChild);
      }
      bookingsContainer.classList.remove("hidden");

      data.bookings.forEach((booking, i) => {
        const tempData = `<div class="booking-card">
                <div>
                <img src="http://localhost:3000/fetchImage/${booking.image}">
                </div>
                <div id="booking-details">
                <p id="booking-header">${booking.propertyName}</p>
                <p>Booking date:<span>${new Date(booking.bookingDate)
                  .toGMTString()
                  .slice(4, 16)}</span></p>
                <p>Check-in date:<span>${new Date(booking.checkInDate)
                  .toGMTString()
                  .slice(0, 16)}</span></p>
                <p>Check-out date:<span>${new Date(booking.checkOutDate)
                  .toGMTString()
                  .slice(0, 16)}</span></p> 
                <p>Rooms booked:<span>${booking.numberOfRooms} rooms</span></p>
                <p>No. of nights:<span>${
                  booking.numberOfNights
                } nights</span></p>
                <p>Price:<span>₹ ${booking.totalPrice} total</span></p>
                ${btnClass(
                  booking.propertyName,
                  booking.checkInDate,
                  booking.bookingID,
                  booking.propertyID,
                  booking.reviewStatus
                )}
                </div>
            </div>`;

        const appendData = document
          .createRange()
          .createContextualFragment(tempData);

        bookingsContainer.appendChild(appendData);
      });
    }

    openConfirmModal();
  } catch (error) {
    console.log(error);
    alert("Error fetching data. Try Again.");
  }
};

window.onload = getDetails();
