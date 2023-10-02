import { apiKey } from "../config.js"; //import api key from config.js

let loggedIn = true; //login status

// updating Dom with selected recipe
function updateDOM(data) {
  console.log(data);
  document.querySelector(".body-title").textContent = data.title;
  let ingredientList = document.querySelector(".ingredient-list");
  data.extendedIngredients.map((ingredient) => {
    ingredientList.innerHTML += ` <li class="list-group-item">${ingredient.original}</li>`;
  });
  document.querySelector(".img-container img").src = data.image;
  document.querySelector(".content p").innerHTML = data.summary;
  let instructionList = document.querySelector(".instruction-list");
  data.analyzedInstructions.map((instr) => {
    let fli = document.createElement("li");
    let listHead = document.createElement("h6");
    listHead.innerText = instr.name;
    fli.appendChild(listHead);
    fli.classList.add("mt-3", "w-100");
    let ul = document.createElement("ol");
    instr.steps.map((step) => {
      ul.innerHTML += `<li class="mt-3">${step.step}</li>`;
    });
    fli.appendChild(ul);
    instructionList.appendChild(fli);
  });
}

// accessing the card Id on content load
function setCardId() {
  const urlParams = new URLSearchParams(window.location.search);
  let cardId = urlParams.get("cardId");
  return cardId;
}

// fetching the particular item using id
let Id = setCardId();
let apiURL = `https://api.spoonacular.com/recipes/${Id}/information?apiKey=${apiKey}`;
async function fetchItemData() {
  let response = await fetch(apiURL);
  let data = await response.json();
  updateDOM(data);
}
fetchItemData();

// alert for adding to favorites
const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
const appendAlert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible text-center" role="alert">`,
    `   <div class="text-center">${message}</div>`,
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

// storing favorites in localStorage
function add() {
  let data = JSON.parse(localStorage.getItem("users"));
  let user = data.users.find((user) => user.login == true);
  if (user.favorites.includes(Id)) {
    appendAlert("item already added", "success");
  } else {
    user.favorites.push(Id);
    localStorage.setItem("users", JSON.stringify(data));
    appendAlert("Added to favorites <3", "success");
  }
}
let addButton = document.getElementById("addButton");
addButton.addEventListener("click", add);

// back to home
function backHome() {
  window.location.href = `./index.html#recipe-section`;
}
let backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", backHome);
