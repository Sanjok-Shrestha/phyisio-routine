/**
 * Exercise database for the physiotherapy routine application.
 * Stores all available exercises with their metadata, instructions, and visual guides.
 */

// Default exercise template to reduce repetition
const EXERCISE_DEFAULTS = {
    sets: 2,
    reps: 10,
    duration: null,
    instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed"
};

const DEFAULT_EXERCISES = [
{
        id: 1,
        name: "Ab Stretch",
        category: "core",
        description: "Description for Ab Stretch.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/ab-stretch.gif"
    },
{
        id: 2,
        name: "Ankle Circles",
        category: "ankle",
        description: "Description for Ankle Circles.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/ankle-circles.gif"
    },
{
        id: 3,
        name: "Ankle Hops",
        category: "ankle",
        description: "Description for Ankle Hops.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/ankle-hops.gif"
    },
{
        id: 4,
        name: "Ankle Tap Push Ups",
        category: "ankle",
        description: "Description for Ankle Tap Push Ups.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/ankle-tap-push-ups.gif"
    },
{
        id: 5,
        name: "Back Balance Chop",
        category: "back",
        description: "Description for Back Balance Chop.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/back-balance-chop.gif"
    },
{
        id: 6,
        name: "Back Bent Over Row Press",
        category: "back",
        description: "Description for Back Bent Over Row Press.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/back-bent-over-row-press.gif"
    },
{
        id: 7,
        name: "Back Bird Dog",
        category: "back",
        description: "Description for Back Bird Dog.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/back-bird-dog.gif"
    },
{
        id: 8,
        name: "Back Extensions",
        category: "back",
        description: "Description for Back Extensions.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/back-extensions.gif"
    },
{
        id: 9,
        name: "Back Stretch",
        category: "back",
        description: "Description for Back Stretch.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/back-stretch.gif"
    },
{
        id: 10,
        name: "Butterfly Stretch",
        category: "general",
        description: "Description for Butterfly Stretch.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/butterfly-stretch.gif"
    },
{
        id: 11,
        name: "Chest Abdominal",
        category: "core",
        description: "Description for Chest Abdominal.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/chest-abdominal.gif"
    },
{
        id: 12,
        name: "Chest Bent Leg Jackknife Exercise",
        category: "knee",
        description: "Description for Chest Bent Leg Jackknife Exercise.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/chest-bent-leg-jackknife-exercise.gif"
    },
{
        id: 13,
        name: "Crunches",
        category: "core",
        description: "Description for Crunches.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/crunches.gif"
    },
{
        id: 14,
        name: "Neck Tilt",
        category: "neck",
        description: "Description for Neck Tilt.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/neck-tilt.gif"
    },
{
        id: 15,
        name: "Plank",
        category: "general",
        description: "Description for Plank.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/plank.gif"
    },
{
        id: 16,
        name: "Shoulder Arm Swing",
        category: "shoulder",
        description: "Description for Shoulder Arm Swing.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/shoulder-arm-swing.gif"
    },
{
        id: 17,
        name: "Shoulder Lunge Front",
        category: "shoulder",
        description: "Description for Shoulder Lunge Front.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/shoulder-lunge-front.gif"
    },
{
        id: 18,
        name: "Shoulder Roll",
        category: "shoulder",
        description: "Description for Shoulder Roll.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/shoulder-roll.gif"
    },
{
        id: 19,
        name: "Shoulder Squeeze Reverse Lunge",
        category: "shoulder",
        description: "Description for Shoulder Squeeze Reverse Lunge.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/shoulder-squeeze-reverse-lunge.gif"
    },
{
        id: 20,
        name: "Shoulder Stretch",
        category: "shoulder",
        description: "Description for Shoulder Stretch.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/shoulder-stretch.gif"
    },
{
        id: 21,
        name: "Jumping Jacks",
        category: "general",
        description: "Description for Jumping Jacks.",
        instructions: "1. Follow standard form\n2. Control movement\n3. Repeat as needed",
        sets: 2,
        reps: 10,
        duration: null,
        gif: "images/jumping-jacks.gif"
    }
];

/**
 * Initialize exercises from localStorage or use defaults.
 * Provides persistence across sessions.
 */
let exercises = [];

/**
 * Loads exercises from localStorage or uses default exercises.
 * @returns {Array} Array of exercise objects
 */
function loadExercises() {
    try {
        const savedExercises = localStorage.getItem('physioExercises');
        return savedExercises ? JSON.parse(savedExercises) : DEFAULT_EXERCISES;
    } catch (error) {
        console.warn('Failed to load exercises from localStorage, using defaults:', error);
        return DEFAULT_EXERCISES;
    }
}

/**
 * Saves exercises to localStorage.
 * @param {Array} data - Array of exercise objects to save
 * @returns {boolean} True if saved successfully, false otherwise
 */
function saveExercises(data) {
    try {
        localStorage.setItem('physioExercises', JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save exercises to localStorage:', error);
        return false;
    }
}

/**
 * Gets an exercise by ID.
 * @param {number} id - The exercise ID
 * @returns {Object|null} The exercise object or null if not found
 */
function getExerciseById(id) {
    if (!Array.isArray(exercises)) return null;
    return exercises.find(exercise => exercise.id === id) || null;
}

/**
 * Gets exercises filtered by category.
 * @param {string} category - The category name
 * @returns {Array} Array of exercises in the specified category
 */
function getExercisesByCategory(category) {
    if (!Array.isArray(exercises)) return [];
    return exercises.filter(exercise => exercise.category === category);
}

/**
 * Gets all unique categories from exercises.
 * @returns {Array<string>} Array of category names
 */
function getCategories() {
    if (!Array.isArray(exercises)) return [];
    return [...new Set(exercises.map(exercise => exercise.category))];
}

// Initialize exercises
exercises = loadExercises();

// Export exercises and utility functions for use in module and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        exercises, 
        loadExercises, 
        saveExercises,
        getExerciseById,
        getExercisesByCategory,
        getCategories
    };
} else {
    window.exercises = exercises;
    window.loadExercises = loadExercises;
    window.saveExercises = saveExercises;
    window.getExerciseById = getExerciseById;
    window.getExercisesByCategory = getExercisesByCategory;
    window.getCategories = getCategories;
}
