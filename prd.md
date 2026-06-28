# Meal Planner - Product Requirements Document

## Overview
A meal planning application that suggests meals based on available ingredients, time constraints, and meal history.

## Target Users
- Busy students/professionals
- People wanting to reduce food waste
- Those seeking meal variety

## Core Features & Requirements

### 1. Meal Suggestions
- **Priority**: High
- **Description**: Recommends meals based on:
  - Available ingredients
  - Available preparation time
  - Recent meal history (avoid repetition)
- **Acceptance Criteria**:
  - Must filter out meals requiring unavailable ingredients
  - Must prioritize meals that haven't been eaten recently
  - Must sort meals by preparation time when time filter is active

### 2. Meal Management
- **Priority**: High
- **Description**: CRUD operations for meals
- **Fields per meal**:
  - Name
  - Ingredients list
  - Preparation time
  - Instructions
  - Tags (quick, vegetarian, etc.)

### 3. Pantry Tracking
- **Priority**: Medium
- **Description**: Track available ingredients
- **Functions**:
  - Add/remove items
  - Bulk reset pantry
  - Shopping list generation

### 4. Meal History
- **Priority**: Medium
- **Description**: Track consumed meals
- **Functions**:
  - Log meals with date
  - View weekly/monthly meal patterns

### Technical Requirements
- **Frontend**: React.js
- **Backend**: Node.js/Express
- **Database**: SQLite (local), MongoDB (cloud option)
- **Responsive Design**: Mobile-first approach

### Future Considerations
- Recipe import functionality
- Nutritional tracking
- Shopping list integration with grocery apps