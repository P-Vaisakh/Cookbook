import { apiKey } from "../config.js";


function handleCardClick(event){
   let cardId = event.currentTarget.id;
   window.location.href = `./recipe.html?cardId=${cardId}`;
}

function updateDOM(data) {
  let card = document.createElement("div");
  card.classList.add("card");
  card.style.width = "18rem";
  card.id = data.id;
  card.addEventListener("click", handleCardClick);
  console.log(data);
  card.innerHTML = `<img
      src="${data.image}"
      class="card-img-top"
      alt="..."
    />
    <div class="card-body d-flex flex-column">
      <h5 class="card-title text-center">${data.title}</h5>
    </div>
    <p class="text-dark text-center fs-6 mb-0 flex-end">click to view details and instructions</p>`;
  let container = document.querySelector(".container");
  container.appendChild(card);
}


async function fetchItemData(Id) {
  let apiURL = `https://api.spoonacular.com/recipes/${Id}/information?apiKey=${apiKey}`;
  let response = await fetch(apiURL);
  let data = await response.json();
  updateDOM(data);
}


let data = JSON.parse(localStorage.getItem("users"));
let user = data.users.find((user) => user.login == true);
user.favorites.forEach((item) => {
  fetchItemData(item)
});
