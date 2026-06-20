# Meal Planner Proposal

## Overview
I'm building a meal planner that recommends what to eat based on, ingredients I have available, time available for preparation, meals already eaten this week.

## Target User & Purpose
- **For**: Myself (busy student with classes, volleyball, and extracurriculars)
- **Why**:
  - Reduce wasted time deciding meals
  - Avoid discovering missing ingredients too late
  - Minimize meal repetition throughout the week

## Data Model
- **State tracking**:
  - Meal list
  - Pantry inventory 
  - Time filter
  - Meal history

## Core Features
1. Meal suggestion based on:
   - Available ingredients
   - Available time
   - Recency of meal
2. Meal management:
   - Add new meals with:
     - Required ingredients
     - Preparation time
3. Pantry tracking:
   - Add/remove items
   - Reset full pantry
4. Meal history:
   - Mark meals as eaten with date
   - Track recent meals

## Open Questions
1. Implementation:
   - How to store and update:
     - Meal list
     - Pantry inventory
     - Meal history
2. Logic:
   - How to filter meals based optimally combining:
     - Multiple ingredients
     - Time constraints
     - Recent meal history