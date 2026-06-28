// STATE
const state = {
  recipes: [],
  pantry: [],
  grocery: [],
  planner: {},
  portionMultiplier: 1
};

function saveState() {
  localStorage.setItem("appState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("appState");
  if (saved) Object.assign(state, JSON.parse(saved));
}

loadState();

// UTIL
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

/* NAVIGATION */
$$(".nav-link").forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view;
    $$(".nav-link").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    $$(".app-view").forEach(v => v.classList.remove("active"));
    $("#view-" + view).classList.add("active");
  });
});

/* ---------- RECIPE LIBRARY ---------- */
const recipeForm = $("#recipe-form");
if (recipeForm) {
  recipeForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#recipe-name").value.trim();
    const ingredients = $("#recipe-ingredients").value.split(",").map(i => i.trim());
    const calories = parseFloat($("#recipe-calories").value);
    const protein = parseFloat($("#recipe-protein").value);

    state.recipes.push({
      id: Date.now(),
      name,
      ingredients,
      calories,
      protein
    });

    saveState();
    recipeForm.reset();
    renderRecipes();
    renderSuggestions();
  });
}

function renderRecipes() {
  const container = $("#recipe-list");
  if (!container) return;

  if (state.recipes.length === 0) {
    container.innerHTML = "<p>No recipes yet. Add one above.</p>";
    return;
  }

  container.innerHTML = state.recipes.map(r => `
    <div class="meal-card">
      <h3>${r.name}</h3>
      <p><strong>Ingredients:</strong> ${r.ingredients.join(", ")}</p>
      <p><strong>Calories:</strong> ${r.calories}</p>
      <p><strong>Protein:</strong> ${r.protein} g</p>
    </div>
  `).join("");
}

/* ---------- PANTRY ---------- */
const pantryInput = $("#pantry-input");
const addPantryBtn = $("#add-to-pantry");
if (addPantryBtn) {
  addPantryBtn.addEventListener("click", () => {
    const items = pantryInput.value.split(",").map(i => i.trim()).filter(i => i);
    state.pantry = [...new Set([...state.pantry, ...items])];
    pantryInput.value = "";
    saveState();
    renderPantry();
    renderSuggestions();
  });
}

function renderPantry() {
  const container = $("#current-pantry");
  if (!container) return;

  if (state.pantry.length === 0) {
    container.innerHTML = "<p>No pantry items yet.</p>";
    return;
  }

  container.innerHTML = state.pantry.map(i => `<span class="pantry-item">${i}</span>`).join("");
}

/* ---------- GROCERY ---------- */
const groceryInput = $("#grocery-input");
const addGroceryBtn = $("#add-grocery");
if (addGroceryBtn) {
  addGroceryBtn.addEventListener("click", () => {
    const text = groceryInput.value.trim();
    if (!text) return;
    state.grocery.push({ id: Date.now(), text, done: false });
    groceryInput.value = "";
    saveState();
    renderGrocery();
  });
}

function renderGrocery() {
  const list = $("#grocery-list");
  if (!list) return;

  list.innerHTML = state.grocery.map(item => `
    <li>
      <input type="checkbox" ${item.done ? "checked" : ""} 
             onclick="toggleGrocery(${item.id})">
      ${item.text}
    </li>
  `).join("");
}

window.toggleGrocery = function(id) {
  const item = state.grocery.find(i => i.id === id);
  if (!item) return;
  item.done = !item.done;
  saveState();
  renderGrocery();
};

/* ---------- WEEKLY PLANNER ---------- */
function renderPlanner() {
  const grid = $("#planner-grid");
  if (!grid) return;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  grid.innerHTML = days.map(day => `
    <div class="planner-day">
      <h3>${day}</h3>

      <div class="meal-slot">
        <strong>Breakfast</strong>
        <button class="add-meal-btn" onclick="openMealPicker('${day}', 'breakfast')">Add Meal</button>
        <div id="${day}-breakfast"></div>
      </div>

      <div class="meal-slot">
        <strong>Lunch</strong>
        <button class="add-meal-btn" onclick="openMealPicker('${day}', 'lunch')">Add Meal</button>
        <div id="${day}-lunch"></div>
      </div>

      <div class="meal-slot">
        <strong>Dinner</strong>
        <button class="add-meal-btn" onclick="openMealPicker('${day}', 'dinner')">Add Meal</button>
        <div id="${day}-dinner"></div>
      </div>
    </div>
  `).join("");

  renderPlannerAssignments();
}

window.openMealPicker = function(day, mealType) {
  if (state.recipes.length === 0) {
    alert("Add recipes first!");
    return;
  }

  const recipeNames = state.recipes.map(r => r.name);
  const choice = prompt(
    `Choose a meal for ${day} (${mealType}):\n\n` + recipeNames.join("\n")
  );

  if (!choice) return;

  const recipe = state.recipes.find(
    r => r.name.toLowerCase() === choice.toLowerCase()
  );

  if (!recipe) {
    alert("Recipe not found.");
    return;
  }

  if (!state.planner[day]) state.planner[day] = {};
  state.planner[day][mealType] = recipe.id;

  saveState();
  renderPlannerAssignments();
};

function renderPlannerAssignments() {
  for (const day in state.planner) {
    for (const mealType in state.planner[day]) {
      const recipeId = state.planner[day][mealType];
      const recipe = state.recipes.find(r => r.id === recipeId);

      const slot = document.getElementById(`${day}-${mealType}`);
      if (slot && recipe) {
        slot.innerHTML = `<p>${recipe.name}</p>`;
      }
    }
  }
}

/* ---------- NUTRITION ---------- */
const portionInput = $("#portion-multiplier");
const updateNutritionBtn = $("#update-nutrition");

if (updateNutritionBtn) {
  updateNutritionBtn.addEventListener("click", () => {
    const val = parseFloat(portionInput.value) || 1;
    state.portionMultiplier = val;
    saveState();
    renderNutrition();
  });
}

function renderNutrition() {
  const container = $("#nutrition-summary");
  if (!container) return;

  const totalCalories = state.recipes.reduce((sum, r) => sum + r.calories, 0) * state.portionMultiplier;
  const totalProtein = state.recipes.reduce((sum, r) => sum + r.protein, 0) * state.portionMultiplier;

  container.innerHTML = `
    <p><strong>Total calories:</strong> ${totalCalories.toFixed(0)}</p>
    <p><strong>Total protein:</strong> ${totalProtein.toFixed(1)} g</p>
  `;
}

/* ---------- SUGGESTIONS ---------- */
function renderSuggestions() {
  const container = $("#suggestions");
  if (!container) return;

  if (state.pantry.length === 0 || state.recipes.length === 0) {
    container.innerHTML = "<p>Add pantry items and recipes to see suggestions.</p>";
    return;
  }

  const suggestions = state.recipes.filter(r =>
    r.ingredients.every(i => state.pantry.includes(i))
  );

  container.innerHTML = suggestions.length
    ? suggestions.map(r => `<div class="meal-card"><h3>${r.name}</h3></div>`).join("")
    : "<p>No recipes match your pantry yet.</p>";
}

/* ---------- INITIAL RENDER ---------- */
function renderAll() {
  renderRecipes();
  renderPantry();
  renderGrocery();
  renderPlanner();
  renderNutrition();
  renderSuggestions();
}

renderAll();

