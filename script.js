document.addEventListener("DOMContentLoaded", () => {

  /* UTIL */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  /* STATE */
  const state = {
    recipes: [],     // Meal Library
    pantry: [],      // Pantry
    planner: {},     // Weekly Planner
    totalCalories: 0,
    totalProtein: 0,
  };

  /* SAVE + LOAD */
  function saveState() {
    localStorage.setItem("mealPlannerPro", JSON.stringify(state));
  }

  function loadState() {
    const saved = localStorage.getItem("mealPlannerPro");
    if (saved) Object.assign(state, JSON.parse(saved));
  }

  loadState();

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

  /* RESET */
  $("#reset-app").addEventListener("click", () => {
    if (confirm("Reset all data?")) {
      state.recipes = [];
      state.pantry = [];
      state.planner = {};
      state.totalCalories = 0;
      state.totalProtein = 0;
      saveState();
      renderAll();
    }
  });

  /* ------------------------------
     ADD RECIPE (MEAL LIBRARY)
  ------------------------------ */
  $("#recipe-form").addEventListener("submit", e => {
    e.preventDefault();

    const name = $("#recipe-name").value.trim();
    const calories = parseFloat($("#recipe-calories").value);
    const protein = parseFloat($("#recipe-protein").value);

    if (!name || isNaN(calories) || isNaN(protein)) return;

    state.recipes.push({
      id: Date.now(),
      name,
      calories,
      protein
    });

    saveState();
    renderMealLibrary();
    e.target.reset();
  });

  /* ------------------------------
     ADD PANTRY ITEM
  ------------------------------ */
  $("#pantry-form").addEventListener("submit", e => {
    e.preventDefault();

    const name = $("#pantry-name").value.trim();
    const quantity = $("#pantry-qty").value.trim();

    if (!name || !quantity) return;

    state.pantry.push({
      id: Date.now(),
      name,
      quantity
    });

    saveState();
    renderPantry();
    e.target.reset();
  });

  /* ------------------------------
     MEAL LIBRARY (recipes only)
  ------------------------------ */
  function renderMealLibrary() {
    const container = $("#meal-library");
    const items = state.recipes;

    if (!items || items.length === 0) {
      container.innerHTML = "<p>No recipes yet.</p>";
      return;
    }

    container.innerHTML = items.map(i => `
      <div class="meal-card">
        <h3>${i.name}</h3>
        <p>${i.calories} cal • ${i.protein} g</p>
      </div>
    `).join("");
  }

  /* ------------------------------
     PANTRY (inventory)
  ------------------------------ */
  function renderPantry() {
    const container = $("#pantry-list");
    const items = state.pantry;

    if (!items || items.length === 0) {
      container.innerHTML = "<p>No pantry items yet.</p>";
      return;
    }

    container.innerHTML = items.map(i => `
      <div class="pantry-card">
        <h3>${i.name}</h3>
        <p>Qty: ${i.quantity}</p>
      </div>
    `).join("");
  }

  /* ------------------------------
     WEEKLY PLANNER
  ------------------------------ */
  function renderPlanner() {
    const grid = $("#planner-grid");
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

    grid.innerHTML = days.map(day => `
      <div class="planner-day">
        <h3>${day}</h3>
        <div class="meal-slot">
          <strong>Breakfast</strong>
          <button class="add-meal-btn" onclick="openMealPicker('${day}','breakfast')">Add</button>
          <div id="${day}-breakfast"></div>
        </div>
        <div class="meal-slot">
          <strong>Lunch</strong>
          <button class="add-meal-btn" onclick="openMealPicker('${day}','lunch')">Add</button>
          <div id="${day}-lunch"></div>
        </div>
        <div class="meal-slot">
          <strong>Dinner</strong>
          <button class="add-meal-btn" onclick="openMealPicker('${day}','dinner')">Add</button>
          <div id="${day}-dinner"></div>
        </div>
      </div>
    `).join("");

    renderPlannerAssignments();
  }

  /* ------------------------------
     MODAL PICKER (recipes only)
  ------------------------------ */
  const modal = $("#meal-modal");
  const modalItems = $("#modal-items");
  let modalDay = "";
  let modalMeal = "";

  window.openMealPicker = function(day, mealType) {
    modalDay = day;
    modalMeal = mealType;

    const items = state.recipes;

    if (!items || items.length === 0) {
      modalItems.innerHTML = "<p>No recipes available. Add some in the Meal Library.</p>";
    } else {
      modalItems.innerHTML = items.map(i => `
        <div class="meal-card" onclick="selectMeal(${i.id})">
          <h3>${i.name}</h3>
          <p>${i.calories} cal • ${i.protein} g</p>
        </div>
      `).join("");
    }

    modal.classList.remove("hidden");
  };

  $("#close-modal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  /* ------------------------------
     SELECT MEAL FOR PLANNER
  ------------------------------ */
  window.selectMeal = function(id) {
    const item = state.recipes.find(i => i.id === id);
    if (!item) return;

    if (!state.planner[modalDay]) state.planner[modalDay] = {};
    state.planner[modalDay][modalMeal] = item;

    saveState();
    modal.classList.add("hidden");
    renderPlannerAssignments();
  };

  /* ------------------------------
     PLANNER ASSIGNMENTS + NUTRITION
  ------------------------------ */
  function renderPlannerAssignments() {
    let totalCalories = 0;
    let totalProtein = 0;

    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const meals = ["breakfast","lunch","dinner"];

    days.forEach(day => {
      meals.forEach(meal => {
        const slot = document.getElementById(`${day}-${meal}`);
        if (slot) slot.innerHTML = "";
      });
    });

    for (const day in state.planner) {
      for (const mealType in state.planner[day]) {
        const item = state.planner[day][mealType];
        const slot = document.getElementById(`${day}-${mealType}`);

        if (!slot) continue;

        slot.innerHTML = `
          <p>${item.name}</p>
          <small>${item.calories} cal • ${item.protein} g</small>
        `;

        totalCalories += item.calories;
        totalProtein += item.protein;
      }
    }

    state.totalCalories = totalCalories;
    state.totalProtein = totalProtein;

    renderNutrition();
  }

  /* ------------------------------
     NUTRITION SUMMARY
  ------------------------------ */
  function renderNutrition() {
    $("#nutrition-summary").innerHTML = `
      <p><strong>Total Weekly Calories:</strong> ${state.totalCalories || 0}</p>
      <p><strong>Total Weekly Protein:</strong> ${state.totalProtein || 0} g</p>
    `;
  }

  /* ------------------------------
     INITIAL RENDER
  ------------------------------ */
  function renderAll() {
    renderPlanner();
    renderMealLibrary();
    renderPantry();
    renderNutrition();
  }

  renderAll();

});
