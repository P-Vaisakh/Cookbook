import { apiKey } from "../config.js"; //importing api key from config.js

let loggedIn; //login status

//function on content load
document.addEventListener("DOMContentLoaded", function () {
  let data = JSON.parse(localStorage.getItem("users"));
  let result = data.users.find((user) => user.login == true);
  if (result) {
    loggedIn = true;
    console.log(loggedIn);
    document.querySelector(".signup-container").classList.toggle("d-none");
    document.querySelector(".profile").classList.toggle("d-none");
    document.querySelector(".profile h3").textContent = result.username;
  }
});

//  handle card click
let cardId;
function handleCardClick(event) {
  if (loggedIn == true) {
    cardId = event.currentTarget.id;
    window.location.href = `./recipe.html?cardId=${cardId}`;
  } else {
    alert("login to continue");
  }
}

// updating dom with fetched recipies
function updateDOM(data) {
  let recipeSection = document.querySelector("#recipe-section .container");
  data.recipes.forEach((recipe) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "18rem";
    card.id = recipe.id;
    card.addEventListener("click", handleCardClick);
    card.innerHTML = `<img
      src="${recipe.image}"
      class="card-img-top"
      alt="..."
    />
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${recipe.title}</h5>
    </div>
    <p class="text-dark text-center fs-6 mb-0 flex-end">click to view details and instructions</p>`;
    recipeSection.appendChild(card);
  });
}

//  fetching recipies
const apiURL = "https://api.spoonacular.com/recipes/random";
let number = 8;
async function getData() {
  try {
    const response = await fetch(`${apiURL}?apiKey=${apiKey}&number=${number}`);
    let data = await response.json();
    updateDOM(data);
  } catch (error) {
    console.log("error is :", error);
  }
}
getData();

//get more recipies
document.querySelector("#smButton").addEventListener("click", getData);

// alerts on login and signup
const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
const appendAlert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  const closeButton = wrapper.querySelector(".btn-close");
  closeButton.addEventListener("click", function () {
    // Remove the alert when the close button is clicked
    wrapper.remove();
  });

  alertPlaceholder.append(wrapper);

  let autoCloseDelay = 2000;
  if (autoCloseDelay !== null) {
    setTimeout(() => {
      wrapper.remove();
    }, autoCloseDelay);
  }
};

// signUp , login , profile
let accntBtn = document.getElementById("account");

accntBtn.addEventListener("click", function () {
  document.querySelector(".account").classList.toggle("d-none");
});

// signup
document.querySelector("#signupClick").addEventListener("click", function () {
  if (suname.value && spswd.value && cspswd.value) {
    if (spswd.value == cspswd.value) {
      let obj = {
        username: suname.value,
        pswd: spswd.value,
        login: false,
        favorites: [],
      };
      if ("users" in localStorage) {
        let users = JSON.parse(localStorage.getItem("users"));
        users.users.push(obj);
        localStorage.setItem("users", JSON.stringify(users));
      } else {
        let users = {
          users: [
            {
              username: suname.value,
              pswd: spswd.value,
              login: false,
              favorites: [],
            },
          ],
        };
        localStorage.setItem("users", JSON.stringify(users));
      }
      document.querySelector(".signup-container").classList.toggle("d-none");
      document.querySelector(".login-container").classList.toggle("d-none");
    } else {
      appendAlert("password doesnt match", "success");
    }
  } else {
    appendAlert("all feilds  are required", "success");
  }
});

// change to login
document.querySelector(".loginBtn").addEventListener("click", function () {
  document.querySelector(".signup-container").classList.toggle("d-none");
  document.querySelector(".login-container").classList.toggle("d-none");
});
document.querySelector("#loginClick").addEventListener("click", function () {
  if (userName.value && pswd.value) {
    let data = JSON.parse(localStorage.getItem("users"));
    let result = data.users.find((user) => user.username == userName.value);
    if (result) {
      if (result.pswd == pswd.value) {
        document.querySelector(".login-container").classList.toggle("d-none");
        document.querySelector(".profile").classList.toggle("d-none");
        document.querySelector(".profile h3").textContent = result.username;
        result.login = true;
        loggedIn = true;
        localStorage.setItem("users", JSON.stringify(data));
      } else {
        appendAlert("Incorrect password", "success");
      }
    } else {
      appendAlert("user doesnt exist", "success");
    }
  } else {
    appendAlert("all feilds  are required", "success");
  }
});

// change to signup
document.querySelector(".alt-signup").addEventListener("click", function () {
  document.querySelector(".login-container").classList.toggle("d-none");
  document.querySelector(".signup-container").classList.toggle("d-none");
});

// logout
document.querySelector("#logoutClick").addEventListener("click", function () {
  document.querySelector(".profile").classList.toggle("d-none");
  document.querySelector(".login-container").classList.toggle("d-none");
  let data = JSON.parse(localStorage.getItem("users"));
  let result = data.users.find((user) => user.login === true);
  result.login = false;
  loggedIn = false;
  localStorage.setItem("users", JSON.stringify(data));
});


//redirection to favorites page
document.querySelector(".profile h6").addEventListener("click",function(){
  window.location="./favorites.html"
})
