// getting elements

// const user_info = document.querySelector("#user_info");
const bottom_header = document.getElementById("bottom_header");
const room_count_container = document.getElementById("room_count_container");
const room_count = document.getElementById("room_count");
const dropdownBtns = document.querySelectorAll(".header_dropdown_btn");
const modal_container = document.querySelector(".modal_container");
const loginModal = document.querySelector("#login_modal_container");
const signupModal = document.querySelector("#signup_modal_container");
const signinAlertModal = document.querySelector("#signinAlert_modal_container");
const logoutAlertModal = document.querySelector("#logout_modal_container");
const registerPropertyModal = document.querySelector(
  "#property_registration_modal_container"
);
const dropdownIcon = document.querySelector("#top_header_dropdown_container");
const dropdown_button_container = document.getElementById(
  "dropdown_button_container"
);
const hostDiv = document.querySelector("#host_div");
const contactUsModal = document.querySelector("#contact_modal_container");
const contactBtn = document.querySelector("#contactBtn");


const showContactModal = () => {
  toggleHide(modal_container);
  toggleHide(contactUsModal);
};

// my function to toggle hidden class
const toggleHide = (ele) => {
  return ele.classList.toggle("hidden");
};

// dropdown hide toggle

contactBtn.addEventListener("click", showContactModal);

Array.from(dropdownIcon.children).forEach(child =>{
  child.addEventListener("click", () => {
    if (hostDiv.style.visibility === "hidden") {
      hostDiv.style.visibility = "visible";
    } else {
      hostDiv.style.visibility = "hidden";
    }
    toggleHide(dropdown_button_container);
  });
})



// open sign in and other modals

const showLoginPage = () => {
  toggleHide(modal_container);
  toggleHide(loginModal);
};

const openModals = (e) => {
  if (e.target.value === "Log In") {
    toggleHide(modal_container);
    toggleHide(loginModal);
  }
  if (e.target.value === "My Account") {
    console.log("account");
    window.location.href = `http://localhost:3000/user/account/${hostDiv.dataset.name}/dashboard`;
  } else if (e.target.value === "Sign Up") {
    toggleHide(modal_container);
    toggleHide(signupModal);
  } else if (e.target.value === "Host your home") {
    toggleHide(modal_container);
    toggleHide(signinAlertModal);
  } else if (e.target.value === "Register Home") {
    toggleHide(modal_container);
    toggleHide(registerPropertyModal);
  } else if (e.target.value === "Log Out") {
    (async function () {
      try {
        const url = "http://localhost:3000/user/logout";
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
          toggleHide(modal_container);
          toggleHide(logoutAlertModal);
        }
      } catch (error) {
        alert("Error logging out");
        console.log(error);
      }
    })();
  }
};

// function to close modal and pop ups
window.onclick = (e) => {
  if (e.target === modal_container) {
    if (!logoutAlertModal.classList.contains("hidden")) {
      window.location.href = "http://localhost:3000/";
    }
    toggleHide(modal_container);

    Array.from(modal_container.children).forEach((child) => {
      if (!child.classList.contains("hidden")) {
        toggleHide(child);
      }
    });
  }

  if (
    !dropdown_button_container.classList.contains("hidden") &&
    e.target.parentElement != dropdownIcon
  ) {
    toggleHide(dropdown_button_container);
    hostDiv.style.visibility = "visible";
  }
  if (e.target === document.body) {
    if (!bottom_header.classList.contains("hidden")) {
      toggleHide(bottom_header);
    }
    if (!room_count_container.classList.contains("hidden")) {
      toggleHide(room_count_container);
    }
  }
};

// adding event listeners to open modals
dropdownBtns.forEach((btn) => btn.addEventListener("click", openModals));

// function to view header search bar
const toggleSearchContainer = () => {
  toggleHide(bottom_header);
};

// functions for adding guests in search bar
const selectFilters = () => {
  toggleHide(room_count_container);
};

const plusOne = () => {
  room_count.value = parseInt(room_count.value) + 1;
};
const minusOne = () => {
  if (room_count.value != 0) room_count.value = parseInt(room_count.value) - 1;
};
