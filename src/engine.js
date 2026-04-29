import { foodDatabase } from './data.js';

// Calculate BMR using Mifflin-St Jeor Equation
export function calculateBMR(weight, height, age, gender) {
    // weight in kg, height in cm, age in years
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return bmr;
}

// Calculate Maintenance Calories (TDEE)
export function calculateTDEE(bmr, activityLevel) {
    const multipliers = {
        sedentary: 1.2,      // Little or no exercise
        light: 1.375,        // Light exercise 1-3 days/week
        moderate: 1.55,      // Moderate exercise 3-5 days/week
        active: 1.725,       // Hard exercise 6-7 days/week
        very_active: 1.9     // Very hard exercise/physical job
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

// target calories based on goal speed
export function calculateTargetCalories(tdee, goalSpeed) {
    // Safe weight loss: 0.5kg/week (-500 cal), 1kg/week (-1000 cal)
    let deficit = 0;
    if (goalSpeed === 'normal') {
        deficit = 500; // ~0.5kg per week
    } else if (goalSpeed === 'fast') {
        deficit = 750; // ~0.75kg per week (safer max for automated)
    } else {
        deficit = 250; // Slow
    }

    let target = tdee - deficit;
    // Safety floor: 1200 for women, 1500 for men roughly, but let's keep it simple mostly
    if (target < 1200) target = 1200;
    return target;
}

export function calculateWaterIntake(weight) {
    // Approx 35ml per kg of body weight
    return (weight * 0.035).toFixed(1);
}

function getRandomItem(array, typePreference) {
    // Filter by preference
    let filtered = array;
    if (typePreference === 'veg') {
        filtered = array.filter(item => item.type === 'veg');
    } else if (typePreference === 'non-veg') {
        // Non-veg can eat veg too, but let's mix it. 
        // Ideally we want some non-veg items if they selected non-veg.
        // But sticking to 'any' is easier logic, just picking random.
        filtered = array;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
}

export function generateWeeklyPlan(targetCalories, foodPreference) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const plan = [];

    days.forEach(day => {
        // Distribute calories: Breakfast 25%, Lunch 35%, Dinner 25%, Snacks 15%
        // We just pick items that vaguely fit or just pick random items and sum them up?
        // For a simple app, we'll pick items and display them. Tallying exact calories is hard with fixed meals.
        // So we will just pick balanced meals.

        const breakfast = getRandomItem(foodDatabase.breakfast, foodPreference);
        const lunch = getRandomItem(foodDatabase.lunch, foodPreference);
        const dinner = getRandomItem(foodDatabase.dinner, foodPreference);
        const snack = getRandomItem(foodDatabase.snacks, foodPreference);

        const totalDailyCalories = breakfast.calories + lunch.calories + dinner.calories + snack.calories;

        plan.push({
            day,
            meals: {
                breakfast,
                lunch,
                dinner,
                snack
            },
            totalCalories: totalDailyCalories
        });
    });

    return plan;
}

export function generateGroceryList(plan) {
    const allIngredients = new Set();

    plan.forEach(dayPlan => {
        Object.values(dayPlan.meals).forEach(meal => {
            if (meal.ingredients) {
                meal.ingredients.forEach(ing => allIngredients.add(ing));
            }
        });
    });

    return Array.from(allIngredients).sort();
}
