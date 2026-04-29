import './style.css'
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateWaterIntake, generateWeeklyPlan, generateGroceryList } from './engine.js'


// Attach standard event listeners
const form = document.querySelector('#diet-form');
const resultsSection = document.querySelector('#results-section');
const inputSection = document.querySelector('#input-section'); // Although we don't hide it necessarily, let's keep it visible or scroll.
const weeklyPlanContainer = document.querySelector('#weekly-plan');
const regenerateBtn = document.querySelector('#regenerate-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const age = parseInt(document.querySelector('#age').value);
  const gender = document.querySelector('#gender').value;
  const weight = parseFloat(document.querySelector('#weight').value);
  const height = parseFloat(document.querySelector('#height').value);
  const activity = document.querySelector('#activity').value;
  const preference = document.querySelector('#preference').value;
  const goal = document.querySelector('#goal').value;

  // Calculate Logic
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activity);
  const targetCalories = calculateTargetCalories(tdee, goal);
  const water = calculateWaterIntake(weight);

  // Generate Plan
  const plan = generateWeeklyPlan(targetCalories, preference);

  // Render Logic
  renderResults(bmr, targetCalories, water, plan);
});

regenerateBtn.addEventListener('click', () => {
  // Just Trigger submit again or clear?
  // User wants to generate again.
  // We can just re-run the generation with current values.
  form.requestSubmit();
});

function renderResults(bmr, calories, water, plan) {
  document.querySelector('#bmr-value').textContent = Math.round(bmr);
  document.querySelector('#target-calories').textContent = Math.round(calories);
  document.querySelector('#daily-water').textContent = water + ' L';

  weeklyPlanContainer.innerHTML = '';

  plan.forEach(dayPlan => {
    const card = document.createElement('div');
    card.className = 'day-card';

    card.innerHTML = `
      <div class="day-title">${dayPlan.day}</div>
      <div class="meal-row">
        <span class="meal-name">Breakfast</span>
        <div class="meal-desc">
            <div>${dayPlan.meals.breakfast.name}</div>
            <span class="meal-cals">${dayPlan.meals.breakfast.calories} kcal</span>
        </div>
      </div>
      <div class="meal-row">
        <span class="meal-name">Lunch</span>
        <div class="meal-desc">
            <div>${dayPlan.meals.lunch.name}</div>
            <span class="meal-cals">${dayPlan.meals.lunch.calories} kcal</span>
        </div>
      </div>
      <div class="meal-row">
        <span class="meal-name">Snack</span>
        <div class="meal-desc">
            <div>${dayPlan.meals.snack.name}</div>
            <span class="meal-cals">${dayPlan.meals.snack.calories} kcal</span>
        </div>
      </div>
      <div class="meal-row">
        <span class="meal-name">Dinner</span>
        <div class="meal-desc">
            <div>${dayPlan.meals.dinner.name}</div>
            <span class="meal-cals">${dayPlan.meals.dinner.calories} kcal</span>
        </div>
      </div>
      <div class="meal-row" style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 5px;">
        <span class="meal-name">Total</span>
        <span class="meal-cals" style="font-weight: bold; color: var(--primary-dark);">${dayPlan.totalCalories} kcal</span>
      </div>
    `;

    weeklyPlanContainer.appendChild(card);
  });

  // Render Grocery List
  const groceryList = generateGroceryList(plan);
  const groceryContainer = document.querySelector('#grocery-list');
  const grocerySection = document.querySelector('#grocery-section');
  groceryContainer.innerHTML = '';

  groceryList.forEach(item => {
    const div = document.createElement('div');
    div.className = 'grocery-item';
    div.innerHTML = `
        <input type="checkbox" id="item-${item}">
        <label for="item-${item}">${item}</label>
      `;
    groceryContainer.appendChild(div);
  });

  grocerySection.style.display = 'block';

  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}
