const API_URL = "https://api.hanggts.xyz/tools/stockgag";
const container = document.getElementById("inventory-container");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter-buttons button");
const toggleSwitch = document.getElementById("toggle-theme");
const themeIcon = document.getElementById("theme-icon");
const loader = document.getElementById("loader");

let allData = {};
let currentCategory = "all";

// Mengambil data dari APi Hang
async function loadInventory() {
  loader.style.display = "block";
  container.innerHTML = "";

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.status && data.result) {
      allData = data.result;
      renderCategories();
    } else {
      container.innerHTML = "<p>Gagal Mengambil Data.</p>";
    }
  } catch (error) {
    container.innerHTML = `<p>Terjadi kesalahan: ${error.message}</p>`;
  }

  loader.style.display = "none";
}

function renderCategories() {
  container.innerHTML = "";
  for (let category in allData) {
    if (currentCategory !== "all" && category !== currentCategory) continue;
    renderCategory(category, allData[category]);
  }
}

function renderCategory(name, items) {
  const section = document.createElement("div");
  section.className = "category";

  const heading = document.createElement("h2");
  heading.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  section.appendChild(heading);

  const list = document.createElement("div");
  list.className = "item-list";

  items.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    const nameDiv = document.createElement("div");
    nameDiv.className = "item-name";
    nameDiv.textContent = item.name;

    const qtyDiv = document.createElement("div");
    qtyDiv.className = "quantity";
    qtyDiv.textContent = `Quantity: ${item.quantity}`;

    itemDiv.appendChild(nameDiv);
    itemDiv.appendChild(qtyDiv);
    list.appendChild(itemDiv);
  });

  section.appendChild(list);
  container.appendChild(section);
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  document.querySelectorAll(".item").forEach(item => {
    const name = item.querySelector(".item-name").textContent.toLowerCase();
    item.style.display = name.includes(keyword) ? "block" : "none";
  });
});

toggleSwitch.addEventListener("change", () => {
  const isDark = toggleSwitch.checked;
  document.body.classList.toggle("light-mode", !isDark);
  themeIcon.textContent = isDark ? "🌙" : "🌞";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  const isDark = savedTheme === "dark";
  document.body.classList.toggle("light-mode", !isDark);
  toggleSwitch.checked = isDark;
  themeIcon.textContent = isDark ? "🌙" : "🌞";
  loadInventory();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.category;
    renderCategories();
  });
});
