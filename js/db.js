// db.js - Physio Routine Database Module
// Manages routines, exercises, and progress tracking with localStorage persistence

const DB_NAME = 'PhysioRoutineDB';
const DEFAULT_DB = {
    routines: [],
    favorites: [],
    progress: []
};

/**
 * Initialize the database with default structure if it doesn't exist
 */
function initializeDB() {
    if (!localStorage.getItem(DB_NAME)) {
        localStorage.setItem(DB_NAME, JSON.stringify(DEFAULT_DB));
    }
}

/**
 * Retrieve the entire database object
 * @returns {Object} The database object or default empty structure
 */
function getDB() {
    try {
        const data = localStorage.getItem(DB_NAME);
        return data ? JSON.parse(data) : { ...DEFAULT_DB };
    } catch (error) {
        console.error('Error parsing database:', error);
        return { ...DEFAULT_DB };
    }
}

/**
 * Persist data to localStorage
 * @param {Object} data - The database object to save
 * @throws {Error} If localStorage is unavailable
 */
function updateDB(data) {
    try {
        localStorage.setItem(DB_NAME, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to database:', error);
        throw new Error('Failed to save data to database');
    }
}

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 - First date to compare
 * @param {Date|string} date2 - Second date to compare
 * @returns {boolean} True if dates are on the same day
 */
function isSameDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

// ============ ROUTINE MANAGEMENT ============

/**
 * Create a new routine
 * @param {string} name - The name of the routine
 * @param {Array<string>} exercises - Array of exercise IDs
 * @returns {Object} The newly created routine object
 * @throws {Error} If name is not provided
 */
function createRoutine(name, exercises = []) {
    if (!name || typeof name !== 'string') {
        throw new Error('Routine name must be a non-empty string');
    }

    const db = getDB();
    const newRoutine = {
        id: Date.now().toString(),
        name: name.trim(),
        exercises: Array.isArray(exercises) ? exercises : [],
        createdAt: new Date().toISOString(),
        lastUsed: null
    };
    
    db.routines.push(newRoutine);
    updateDB(db);
    return newRoutine;
}

/**
 * Get all routines
 * @returns {Array<Object>} Array of all routines
 */
function getRoutines() {
    const db = getDB();
    return Array.isArray(db.routines) ? db.routines : [];
}

/**
 * Get a specific routine by ID
 * @param {string} id - The routine ID
 * @returns {Object|undefined} The routine object or undefined if not found
 */
function getRoutineById(id) {
    return getRoutines().find(r => r.id === id);
}

/**
 * Update an existing routine
 * @param {string} id - The routine ID to update
 * @param {Object} updates - Object containing properties to update
 * @returns {boolean} True if update was successful
 */
function updateRoutine(id, updates) {
    if (!id) throw new Error('Routine ID is required');

    const db = getDB();
    const routineIndex = db.routines.findIndex(r => r.id === id);
    
    if (routineIndex !== -1) {
        db.routines[routineIndex] = {
            ...db.routines[routineIndex],
            ...updates,
            lastUsed: new Date().toISOString()
        };
        updateDB(db);
        return true;
    }
    
    return false;
}

/**
 * Delete a routine and its associated progress entries
 * @param {string} id - The routine ID to delete
 * @returns {boolean} True if deletion was successful
 */
function deleteRoutine(id) {
    if (!id) throw new Error('Routine ID is required');

    const db = getDB();
    const initialLength = db.routines.length;
    db.routines = db.routines.filter(r => r.id !== id);

    // Clean up associated progress entries
    if (Array.isArray(db.progress)) {
        db.progress.forEach(entry => {
            if (Array.isArray(entry.routinesCompleted)) {
                entry.routinesCompleted = entry.routinesCompleted.filter(
                    rc => rc.routineId !== id
                );
            }
        });
        db.progress = db.progress.filter(entry => 
            entry.routinesCompleted && entry.routinesCompleted.length > 0
        );
    }

    if (db.routines.length !== initialLength) {
        updateDB(db);
        return true;
    }
    return false;
}

/**
 * Add an exercise to a routine
 * @param {string} routineId - The routine ID
 * @param {string} exerciseId - The exercise ID to add
 * @returns {boolean} True if exercise was added
 */
function addExerciseToRoutine(routineId, exerciseId) {
    if (!routineId || !exerciseId) {
        throw new Error('Both routine ID and exercise ID are required');
    }

    const db = getDB();
    const routine = db.routines.find(r => r.id === routineId);
    
    if (routine && Array.isArray(routine.exercises) && !routine.exercises.includes(exerciseId)) {
        routine.exercises.push(exerciseId);
        updateDB(db);
        return true;
    }
    
    return false;
}

/**
 * Remove an exercise from a routine
 * @param {string} routineId - The routine ID
 * @param {string} exerciseId - The exercise ID to remove
 * @returns {boolean} True if exercise was removed
 */
function removeExerciseFromRoutine(routineId, exerciseId) {
    if (!routineId || !exerciseId) {
        throw new Error('Both routine ID and exercise ID are required');
    }

    const db = getDB();
    const routine = db.routines.find(r => r.id === routineId);
    
    if (routine && Array.isArray(routine.exercises)) {
        const initialLength = routine.exercises.length;
        routine.exercises = routine.exercises.filter(id => id !== exerciseId);
        
        if (routine.exercises.length !== initialLength) {
            updateDB(db);
            return true;
        }
    }
    
    return false;
}

// ============ PROGRESS TRACKING ============

/**
 * Log the completion of a routine
 * @param {string} routineId - The routine ID
 * @param {string} routineName - The routine name
 * @param {number} duration - Duration in minutes
 * @returns {Object} The progress entry for today
 * @throws {Error} If required parameters are missing
 */
function logRoutineCompletion(routineId, routineName, duration = 0) {
    if (!routineId || !routineName) {
        throw new Error('Routine ID and name are required');
    }

    const db = getDB();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find or create today's progress entry
    let progressEntry = db.progress.find(p => isSameDay(p.date, today));
    
    if (!progressEntry) {
        progressEntry = {
            date: today.toISOString(),
            activityLevel: 0,
            routinesCompleted: []
        };
        db.progress.push(progressEntry);
    }
    
    // Add the completed routine
    progressEntry.routinesCompleted.push({
        routineId,
        routineName,
        duration: Math.max(0, duration),
        completedAt: now.toISOString()
    });
    
    // Update activity level (capped at 3)
    progressEntry.activityLevel = Math.min(progressEntry.routinesCompleted.length, 3);
    
    updateDB(db);
    return progressEntry;
}

/**
 * Get progress data for a specified number of days
 * @param {number} days - Number of days to retrieve (default: 30)
 * @returns {Array<Object>} Array of progress entries sorted by date
 */
function getProgressData(days = 30) {
    if (days <= 0) {
        throw new Error('Days parameter must be greater than 0');
    }

    const db = getDB();
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return (Array.isArray(db.progress) ? db.progress : [])
        .filter(p => new Date(p.date) >= cutoffDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Get the most recent activity
 * @param {number} limit - Maximum number of activities to return (default: 5)
 * @returns {Array<Object>} Array of recent activities sorted by completion time
 */
function getRecentActivity(limit = 5) {
    if (limit < 0) {
        throw new Error('Limit must be non-negative');
    }

    const db = getDB();
    const allRoutines = (Array.isArray(db.progress) ? db.progress : [])
        .flatMap(p => Array.isArray(p.routinesCompleted) ? p.routinesCompleted : []);
    
    return allRoutines
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, limit);
}

/**
 * Get comprehensive progress statistics
 * @returns {Object} Object containing various progress metrics
 */
function getProgressStats() {
    const db = getDB();
    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);
    
    const progressData = Array.isArray(db.progress) ? db.progress : [];
    const last7DaysData = progressData.filter(p => new Date(p.date) >= last7Days);
    const last30DaysData = progressData.filter(p => new Date(p.date) >= last30Days);
    
    // Calculate active days
    const activeDays7 = last7DaysData.filter(p => p.activityLevel > 0).length;
    const activeDays30 = last30DaysData.filter(p => p.activityLevel > 0).length;
    
    // Calculate total routines completed
    const routines7 = last7DaysData
        .flatMap(p => Array.isArray(p.routinesCompleted) ? p.routinesCompleted : [])
        .length;
    const routines30 = last30DaysData
        .flatMap(p => Array.isArray(p.routinesCompleted) ? p.routinesCompleted : [])
        .length;
    
    // Calculate total duration
    const duration7 = last7DaysData
        .flatMap(p => Array.isArray(p.routinesCompleted) ? p.routinesCompleted : [])
        .reduce((sum, r) => sum + (r.duration || 0), 0);
    const duration30 = last30DaysData
        .flatMap(p => Array.isArray(p.routinesCompleted) ? p.routinesCompleted : [])
        .reduce((sum, r) => sum + (r.duration || 0), 0);
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let checkDate = new Date(today);
    
    // Check if today has activity, if not start from yesterday
    const todayHasActivity = progressData.some(p => 
        isSameDay(p.date, today) && p.activityLevel > 0
    );
    
    if (!todayHasActivity) {
        checkDate.setDate(checkDate.getDate() - 1);
    }
    
    while (true) {
        const hasActivity = progressData.some(p => 
            isSameDay(p.date, checkDate) && p.activityLevel > 0
        );
        
        if (hasActivity) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return {
        activeDays7,
        activeDays30,
        routines7,
        routines30,
        duration7,
        duration30,
        currentStreak
    };
}

// ============ INITIALIZATION & EXPORTS ============

// Initialize the database when this file loads
initializeDB();

// Export for modules or make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Core database functions
        initializeDB,
        getDB,
        updateDB,
        isSameDay,
        // Routine management
        createRoutine,
        getRoutines,
        getRoutineById,
        updateRoutine,
        deleteRoutine,
        addExerciseToRoutine,
        removeExerciseFromRoutine,
        // Progress tracking
        logRoutineCompletion,
        getProgressData,
        getRecentActivity,
        getProgressStats
    };
} else {
    // Make available globally for browser environment
    window.db = {
        // Core database functions
        initializeDB,
        getDB,
        updateDB,
        isSameDay,
        // Routine management
        createRoutine,
        getRoutines,
        getRoutineById,
        updateRoutine,
        deleteRoutine,
        addExerciseToRoutine,
        removeExerciseFromRoutine,
        // Progress tracking
        logRoutineCompletion,
        getProgressData,
        getRecentActivity,
        getProgressStats
    };
}