# 1. Overview

Meal Planner Pro is a vanilla JavaScript weekly meal planning tool that runs entirely in the browser.
- Users can add meals, assign them to days, and view weekly nutrition totals
- All data is stored in localStorage

# 2. Goals

- Provide a simple weekly meal planning interface
- Track calories and protein across the week
- Store recipes and food items in one place
- Keep the app lightweight, offline-friendly, and fast

# 3. Target User

**Primary user:** A busy student who wants a simple, fast meal-planning workflow.

**User needs:**
- A visual weekly planner
- A basic nutrition summary
- A unified meal library
- A tool that works offline

# 4. Core Features

## 4.1 Meal Library

- Add recipes and food items
- Store:
  - Name
  - Calories
  - Protein
- Display all meals in a combined list
- Persist in localStorage

## 4.2 Weekly Planner

- Seven-day grid (Mon–Sun)
- Three meal slots per day:
  - Each slot shows:
    - Assigned meal
    - Nutrition information
- Planner saved in localStorage

## 4.3 Modal Meal Picker

- Opens when user clicks "Add"
- Shows all meals from the library
- Selecting a meal assigns it to the chosen slot

## 4.4 Nutrition Summary
- Computes weekly totals for calories + protein
- Updates automatically when planner changes

## 4.5 Reset System
- Clears recipes, food items, and planner
- Re-renders UI without refreshing


# 5. User Interactions
- Form submissions (add recipe, add food item)
- Navigation buttons
- Add meal buttons
- Modal selection
- Reset button
- Dynamic DOM updates


## 6. Non‑Functional Requirements
- Performance: Instant load, fast DOM updates
- Reliability: State persists across refreshes
- Usability: Clear navigation, simple forms
- Accessibility: High contrast, large buttons

## 7. Open Questions
- Should meals be removable?
- Should planner support snacks?
- Should nutrition include more macros?
- Should weeks be duplicable?

## 8.  Future Enhancements 
- Drag‑and‑drop meal assignment
- Portion multipliers
- Grocery list generation
- Meal tags
- Dark mode