// getting elements

const main_feed_container = document.getElementById("main_feed_container");
const propertyDiv = document.getElementById("property_div");

let priceBtn;
let priceIcon;

// my function to toggle hidden class
// const toggleHide = (ele) => {
//   return ele.classList.toggle("hidden");
// };

function addBtn() {
  priceBtn = document.querySelectorAll(".price_btn");
  priceIcon = document.querySelectorAll(".price-icon");
  priceBtn.forEach((element) => {
    element.addEventListener("click", getPropertyById);
  });
  priceIcon.forEach((icon) => icon.addEventListener("click", getPropertyById));
}

// render page function
const renderPage = (data) => {
  const cities = [];

  while (propertyDiv.firstChild) {
    propertyDiv.removeChild(propertyDiv.firstChild);
  }

  if (data.length === 0) {
    const newdata = `<div class="col-md-10 col-12 mx-auto">
    <div class="error-svg-container"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
 <path style="fill:#FF877F;" d="M9.694,468.335L256,30.865l246.306,437.47H9.694z"/>
 <g>
   <path style="fill:#573A32;" d="M243.2,140.8v204.8c0,7.074,5.726,12.8,12.8,12.8c7.074,0,12.8-5.726,12.8-12.8V140.8
     c0-7.074-5.726-12.8-12.8-12.8C248.926,128,243.2,133.726,243.2,140.8z"/>
   <path style="fill:#573A32;" d="M508.57,442.735L278.17,43.674c-4.574-7.919-13.022-12.8-22.17-12.8
     c-9.148,0-17.596,4.881-22.17,12.8L3.43,442.735c-4.574,7.919-4.574,17.681,0,25.6s13.022,12.8,22.17,12.8h460.8
     c9.148,0,17.596-4.881,22.17-12.8C513.143,460.416,513.143,450.654,508.57,442.735z M25.6,455.535L256,56.474l230.4,399.061H25.6z"
     />
   <circle style="fill:#573A32;" cx="256" cy="409.6" r="25.6"/>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 </svg>
 </div>
    <div id="error-div">No such properties. Try other options.</div>
    </div>`;
    const dataRangeFragment = document
      .createRange()
      .createContextualFragment(newdata);
    propertyDiv.appendChild(dataRangeFragment);
  } else {
    for (let i = 0; i < data.length; i++) {
      const newdata = `<div class="col-md-3 card mx-auto">
                  <img src="http://localhost:3000/fetchImage/${
                    data[i].images[Math.floor(Math.random() * 5)]
                  }" class="card-img-top" alt="img">
                  <div class="card-body">
                      <h5 class="card-title">${data[i].propertyName}</h5>
                  </div>
                  <ul class="list-group">
                      <li class="list-group-item"><span>${data[i].city}, ${
        data[i].country
      }</span><span><span class="star-icon material-symbols-outlined">
                      star
                      </span>${data[i].rating.slice(0, 3)}</span></li>
                  </ul>
                  <button class="btn price_btn" value="${
                    data[i].propertyID
                  }">₹ ${data[i].price} night  <span data-id="${
        data[i].propertyID
      }" class="price-icon material-symbols-outlined">
                  touch_app
                  </span></button>
              </div>
              <div class="property-type hidden">${data[i].propertyType}</div>
              <div class="review-count hidden">${data[i].reviews}</div>
               
              `;
      const dataRangeFragment = document
        .createRange()
        .createContextualFragment(newdata);
      propertyDiv.appendChild(dataRangeFragment);

      if (!cities.includes(data[i].city)) {
        cities.push(data[i].city);
      }
    }
  }

  // adding city name to search bar
  let cityData = ``;
  cities.forEach((city) => {
    cityData += `<option value="${city}">${
      city.charAt(0).toUpperCase() + city.slice(1)
    }</option>`;
  });
  const cityRangeFragment = document
    .createRange()
    .createContextualFragment(cityData);
  document.getElementById("destination").appendChild(cityRangeFragment);
  addBtn();
};

// fetch hotels
const fetchData = async () => {
  try {
    const url = "http://localhost:3000/property/all";
    const response = await fetch(url);
    let data = await response.json();
    console.log(data);
    document.querySelectorAll(".type-container").forEach((div) =>
      div.addEventListener(
        "click",
        (e) => {
          console.log(e.currentTarget.dataset.type);
          const filterData = data.filter(
            (item) => item.propertyType === e.currentTarget.dataset.type
          );
          console.log(filterData)
          renderPage(filterData);
        }
      )
    );

      

    renderPage(data);
  } catch {
    console.log("error fetching");
  }
};

const getPropertyById = (e) => {
  let propertyID;
  if (e.target.value == undefined) {
    console.log(e.target.dataset.id);
    propertyID = e.target.dataset.id;
  } else {
    propertyID = e.target.value;
  }
  console.log(propertyID);
  const url = `http://localhost:3000/property/id/${propertyID}`;
  window.location.href = url;
};

window.onload = fetchData();
