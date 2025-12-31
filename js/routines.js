    // Add responsive styles for the routine player modal
    const style = document.createElement('style');
    style.textContent = `
    .player-modal-content { max-width: 400px; width: 95vw; margin: 0 auto; padding: 1.5rem; box-sizing: border-box; }
    .player-gif { width: 100%; max-width: 320px; height: auto; display: block; margin: 0 auto 1rem; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .player-exercise-info { text-align: center; margin-bottom: 1rem; }
    .player-controls { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem; }
    .player-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    @media (max-width: 600px) {
      .player-modal-content { padding: 0.5rem; }
      .player-gif { max-width: 100%; }
    }
    `;
    document.head.appendChild(style);

/**
 * Routines Management Module
 * Handles routine creation, editing, deletion, and execution
 */

/**
 * Initialize the routines module when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // ============ DOM ELEMENT CACHING ============
    const routinesContainer = document.getElementById('routines-container');
    const routineBuilder = document.getElementById('routine-builder');
    const routineNameInput = document.getElementById('routine-name');
    const builderExercises = document.getElementById('builder-exercises');
    const saveRoutineBtn = document.getElementById('save-routine');
    const clearBuilderBtn = document.getElementById('clear-builder');
    const tabTriggers = document.querySelectorAll('[data-tab]');
    
    // Configuration
    const CONFIG = {
        INITIAL_LOAD_DELAY: 500,
        EMPTY_ICON: '📋',
        MAX_PREVIEW_EXERCISES: 3
    };
    
    // Current state for builder
    let builderExercisesList = [];
    let isEditingRoutineId = null;
    
    // Load routines when page loads
    loadRoutines();
    
    // ============ TAB SWITCHING ============
    /**
     * Initialize tab switching functionality
     */
    function initializeTabSwitching() {
        tabTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Validate tab exists
                const tabContent = document.getElementById(tabId);
                if (!tabContent) {
                    console.warn(`Tab content with id "${tabId}" not found`);
                    return;
                }
                
                // Update active tab
                tabTriggers.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                tabContent.classList.add('active');
                
                // If switching to builder, update the exercises list
                if (tabId === 'routine-builder') {
                    updateBuilderExercisesList();
                }
            });
        });
    }
    initializeTabSwitching();
    
    // ============ SAVE & CLEAR BUTTONS ============
    /**
     * Initialize save routine button
     */
    saveRoutineBtn.addEventListener('click', function() {
        const name = routineNameInput.value.trim();
        
        if (!name) {
            showToast('Error', 'Please enter a routine name');
            return;
        }
        
        if (builderExercisesList.length === 0) {
            showToast('Error', 'Please add at least one exercise');
            return;
        }
        
        try {
            if (isEditingRoutineId) {
                updateExistingRoutine(isEditingRoutineId, name);
            } else {
                createNewRoutine(name);
            }
        } catch (error) {
            console.error('Error saving routine:', error);
            showToast('Error', 'Failed to save routine. Please try again.');
        }
    });
    
    /**
     * Clear builder button
     */
    clearBuilderBtn.addEventListener('click', function() {
        resetBuilder();
    });

    
    // ============ ROUTINE LOADING & DISPLAY ============
    
    /**
     * Load and display all routines from database
     */
    function loadRoutines() {
        const loadingSpinner = document.getElementById('routines-loading');
        
        try {
            if (!routinesContainer) {
                console.warn('Routines container element not found');
                return;
            }

            // Validate database is available
            if (typeof db === 'undefined' || typeof db.getRoutines !== 'function') {
                throw new Error('Database module not loaded');
            }

            if (loadingSpinner) loadingSpinner.style.display = 'flex';
            
            // Clear existing content except loading spinner
            const children = Array.from(routinesContainer.children).filter(
                child => child.id !== 'routines-loading'
            );
            children.forEach(child => child.remove());
            
            // Simulate loading delay
            setTimeout(() => {
                try {
                    const routines = db.getRoutines();
                    
                    if (!Array.isArray(routines)) {
                        throw new Error('Invalid routines data');
                    }
                    
                    if (routines.length === 0) {
                        displayEmptyState();
                    } else {
                        routines.forEach(routine => {
                            const routineCard = createRoutineCard(routine);
                            if (routineCard) {
                                routinesContainer.appendChild(routineCard);
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error loading routines:', error);
                    routinesContainer.innerHTML = '<p class="error-message">Failed to load routines. Please refresh the page.</p>';
                } finally {
                    if (loadingSpinner) loadingSpinner.style.display = 'none';
                }
            }, CONFIG.INITIAL_LOAD_DELAY);
        } catch (error) {
            console.error('Error in loadRoutines:', error);
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    }
    
    /**
     * Display empty state when no routines exist
     */
    function displayEmptyState() {
        routinesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${CONFIG.EMPTY_ICON}</div>
                <h3>No Routines Yet</h3>
                <p>You haven't created any routines yet. Start by creating one!</p>
                <button class="btn btn-primary" data-tab="routine-builder">Create Routine</button>
            </div>
        `;
        
        // Add click handler to the button
        const createBtn = routinesContainer.querySelector('[data-tab="routine-builder"]');
        if (createBtn) {
            createBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const builderTab = document.querySelector('[data-tab="routine-builder"]');
                if (builderTab) builderTab.click();
            });
        }
    }
    
    /**
     * Create a routine card element
     * @param {Object} routine - The routine object
     * @returns {HTMLElement} The routine card element
     */
    function createRoutineCard(routine) {
        try {
            if (!routine || typeof routine !== 'object') {
                console.warn('Invalid routine object');
                return null;
            }

            const card = document.createElement('div');
            card.className = 'routine-card';
            card.dataset.routineId = routine.id;
            
            // Get exercise details for this routine
            const exerciseDetails = routine.exercises.map(exId => {
                const ex = exercises && exercises.find(e => e.id === exId);
                return ex ? { name: ex.name, category: ex.category } : null;
            }).filter(Boolean);
            
            const createdDate = new Date(routine.createdAt).toLocaleDateString();
            const exerciseCount = routine.exercises.length;
            
            card.innerHTML = `
                <div class="routine-header">
                    <h3>${escapeHtml(routine.name)}</h3>
                    <div class="routine-actions">
                        <button class="btn-icon start-routine" title="Start Routine" aria-label="Start ${escapeHtml(routine.name)}">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="5,3 17,10 5,17" fill="#4CAF50"/></svg>
                        </button>
                        <button class="btn-icon edit-routine" title="Edit Routine" aria-label="Edit ${escapeHtml(routine.name)}">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 3.29a1 1 0 0 1 1.41 0l.59.59a1 1 0 0 1 0 1.41l-9.3 9.3-2 0.59 0.59-2 9.3-9.3zM3 17h14v2H3v-2z" fill="#FFC107"/></svg>
                        </button>
                        <button class="btn-icon delete-routine" title="Delete Routine" aria-label="Delete ${escapeHtml(routine.name)}">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="7" width="10" height="8" rx="2" fill="#F44336"/><rect x="8" y="9" width="1.5" height="5" fill="#fff"/><rect x="10.5" y="9" width="1.5" height="5" fill="#fff"/><rect x="4" y="5" width="12" height="2" fill="#BDBDBD"/></svg>
                        </button>
                    </div>
                </div>
                
                <div class="routine-meta">
                    <span class="routine-date">Created: ${escapeHtml(createdDate)}</span>
                    <span class="routine-count">${escapeHtml(String(exerciseCount))} exercises</span>
                </div>
                
                <div class="routine-exercises">
                    ${exerciseDetails.slice(0, CONFIG.MAX_PREVIEW_EXERCISES).map(ex => `
                        <span class="exercise-tag ${escapeHtml(ex.category)}">${escapeHtml(ex.name)}</span>
                    `).join('')}
                    ${exerciseDetails.length > CONFIG.MAX_PREVIEW_EXERCISES ? `<span class="exercise-tag more">+${exerciseDetails.length - CONFIG.MAX_PREVIEW_EXERCISES} more</span>` : ''}
                </div>
            `;
            
            // Add event listeners
            const startBtn = card.querySelector('.start-routine');
            const editBtn = card.querySelector('.edit-routine');
            const deleteBtn = card.querySelector('.delete-routine');
            
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    try {
                        showRoutinePlayer(routine);
                        if (db && typeof db.updateRoutine === 'function') {
                            db.updateRoutine(routine.id, { lastUsed: new Date().toISOString() });
                        }
                    } catch (error) {
                        console.error('Error starting routine:', error);
                        showToast('Error', 'Failed to start routine');
                    }
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    editRoutine(routine);
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    deleteRoutineWithConfirmation(routine, card);
                });
            }
            
            return card;
        } catch (error) {
            console.error('Error creating routine card:', error);
            return null;
        }
    }
    
    /**
     * Delete routine with user confirmation
     * @param {Object} routine - The routine to delete
     * @param {HTMLElement} card - The routine card element
     */
    function deleteRoutineWithConfirmation(routine, card) {
        if (confirm(`Are you sure you want to delete the routine "${routine.name}"?`)) {
            try {
                if (db && typeof db.deleteRoutine === 'function') {
                    if (db.deleteRoutine(routine.id)) {
                        showToast('Routine Deleted', `"${routine.name}" has been deleted`);
                        card.remove();
                        
                        // If no routines left, show empty state
                        if (document.querySelectorAll('.routine-card').length === 0) {
                            loadRoutines();
                        }
                    }
                }
            } catch (error) {
                console.error('Error deleting routine:', error);
                showToast('Error', 'Failed to delete routine');
            }
        }
    }
    
    // ============ ROUTINE PLAYER ============
    
    /**
     * Display the routine player modal
     * @param {Object} routine - The routine to play
     */
    function showRoutinePlayer(routine) {
        try {
            if (!routine || typeof routine !== 'object') {
                throw new Error('Invalid routine object');
            }

            // Remove any existing modal
            const oldModal = document.getElementById('routine-player-modal');
            if (oldModal) oldModal.remove();

            // Prepare exercises
            const routineExercises = routine.exercises
                .map(id => exercises && Array.isArray(exercises) ? exercises.find(e => e.id === id) : null)
                .filter(Boolean);

            if (routineExercises.length === 0) {
                showToast('Error', 'No valid exercises found in routine');
                return;
            }

            let currentIdx = 0;
            let timer = null;
            let seconds = 0;
            let running = false;

            // Modal HTML
            const modal = document.createElement('div');
            modal.id = 'routine-player-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content player-modal-content">
                    <button class="modal-close" aria-label="Close routine player">&times;</button>
                    <h2>${escapeHtml(routine.name)}</h2>
                    <div class="player-exercise-info">
                        <h3 id="player-exercise-name"></h3>
                        <img id="player-exercise-gif" class="player-gif" src="" alt="Exercise demonstration">
                    </div>
                    <div class="player-controls">
                        <button id="player-prev" class="btn btn-outline" aria-label="Previous exercise">Prev</button>
                        <span id="player-timer" aria-label="Exercise timer">00:00</span>
                        <button id="player-next" class="btn btn-outline" aria-label="Next exercise">Next</button>
                    </div>
                    <div class="player-actions">
                        <button id="player-start" class="btn btn-primary" aria-label="Start timer">Start</button>
                        <button id="player-stop" class="btn btn-outline" style="display:none;" aria-label="Stop timer">Stop</button>
                        <button id="player-done" class="btn btn-success" style="display:none;" aria-label="Finish routine">Finish Routine</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            document.body.classList.add('modal-open');

            // Elements
            const closeBtn = modal.querySelector('.modal-close');
            const prevBtn = modal.querySelector('#player-prev');
            const nextBtn = modal.querySelector('#player-next');
            const timerSpan = modal.querySelector('#player-timer');
            const startBtn = modal.querySelector('#player-start');
            const stopBtn = modal.querySelector('#player-stop');
            const doneBtn = modal.querySelector('#player-done');
            const nameEl = modal.querySelector('#player-exercise-name');
            const gifEl = modal.querySelector('#player-exercise-gif');

            /**
             * Show exercise at given index
             */
            function showExercise(idx) {
                const ex = routineExercises[idx];
                if (ex) {
                    nameEl.textContent = ex.name;
                    gifEl.src = ex.gif || '';
                    gifEl.alt = `${ex.name} demonstration`;
                }
            }

            /**
             * Update timer display
             */
            function updateTimer() {
                const min = String(Math.floor(seconds / 60)).padStart(2, '0');
                const sec = String(seconds % 60).padStart(2, '0');
                timerSpan.textContent = `${min}:${sec}`;
            }

            /**
             * Start the timer
             */
            function startTimer() {
                running = true;
                startBtn.style.display = 'none';
                stopBtn.style.display = '';
                doneBtn.style.display = '';
                timer = setInterval(() => {
                    seconds++;
                    updateTimer();
                }, 1000);
            }

            /**
             * Stop the timer
             */
            function stopTimer() {
                running = false;
                startBtn.style.display = '';
                stopBtn.style.display = 'none';
                if (timer) clearInterval(timer);
            }

            /**
             * Finish the routine and log completion
             */
            function finishRoutine() {
                stopTimer();
                try {
                    if (db && typeof db.logRoutineCompletion === 'function') {
                        db.logRoutineCompletion(routine.id, routine.name, Math.ceil(seconds / 60));
                        showToast('Routine Complete', `You finished "${routine.name}"!`);
                    }
                } catch (error) {
                    console.error('Error logging routine completion:', error);
                    showToast('Warning', 'Routine completed but progress may not have been saved');
                } finally {
                    cleanupModal();
                }
            }

            /**
             * Clean up modal
             */
            function cleanupModal() {
                if (timer) clearInterval(timer);
                if (modal && modal.parentNode) {
                    document.body.removeChild(modal);
                }
                document.body.classList.remove('modal-open');
            }

            // Initialize display
            showExercise(currentIdx);
            updateTimer();

            // Event listeners
            closeBtn.addEventListener('click', cleanupModal);
            prevBtn.addEventListener('click', () => {
                if (currentIdx > 0) {
                    currentIdx--;
                    showExercise(currentIdx);
                }
            });
            nextBtn.addEventListener('click', () => {
                if (currentIdx < routineExercises.length - 1) {
                    currentIdx++;
                    showExercise(currentIdx);
                }
            });
            startBtn.addEventListener('click', startTimer);
            stopBtn.addEventListener('click', stopTimer);
            doneBtn.addEventListener('click', finishRoutine);

            // Cleanup on modal close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanupModal();
                }
            });
        } catch (error) {
            console.error('Error in showRoutinePlayer:', error);
            showToast('Error', 'Failed to load routine player');
        }
    }
    
    // ============ ROUTINE BUILDER ============
    
    /**
     * Create a new routine with validation
     * @param {string} name - The routine name
     */
    function createNewRoutine(name) {
        try {
            if (!db || typeof db.createRoutine !== 'function') {
                throw new Error('Database module not available');
            }

            const newRoutine = db.createRoutine(name, builderExercisesList);
            showToast('Success', `Routine "${newRoutine.name}" created`);
            resetBuilder();
            switchToTab('routines-list');
            loadRoutines();
        } catch (error) {
            console.error('Error creating routine:', error);
            showToast('Error', 'Failed to create routine');
        }
    }
    
    /**
     * Update an existing routine
     * @param {string} routineId - The routine ID
     * @param {string} name - The routine name
     */
    function updateExistingRoutine(routineId, name) {
        try {
            if (!db || typeof db.updateRoutine !== 'function') {
                throw new Error('Database module not available');
            }

            if (db.updateRoutine(routineId, { 
                name,
                exercises: builderExercisesList 
            })) {
                showToast('Success', `Routine "${name}" updated`);
                isEditingRoutineId = null;
                resetBuilder();
                switchToTab('routines-list');
                loadRoutines();
            }
        } catch (error) {
            console.error('Error updating routine:', error);
            showToast('Error', 'Failed to update routine');
        }
    }
    
    /**
     * Reset the routine builder form
     */
    function resetBuilder() {
        routineNameInput.value = '';
        builderExercisesList = [];
        isEditingRoutineId = null;
        saveRoutineBtn.innerHTML = '<span class="icon icon-save"></span> Save Routine';
        updateBuilderExercisesList();
    }
    
    /**
     * Switch to a specific tab
     * @param {string} tabId - The tab ID
     */
    function switchToTab(tabId) {
        const tab = document.querySelector(`[data-tab="${tabId}"]`);
        if (tab) {
            tab.click();
        }
    }
    
    /**
     * Edit an existing routine
     * @param {Object} routine - The routine to edit
     */
    function editRoutine(routine) {
        try {
            if (!routine || typeof routine !== 'object') {
                throw new Error('Invalid routine object');
            }

            // Switch to builder tab
            switchToTab('routine-builder');
            
            // Populate builder with routine data
            routineNameInput.value = routine.name;
            builderExercisesList = [...routine.exercises];
            isEditingRoutineId = routine.id;
            
            // Update save button to show update mode
            saveRoutineBtn.innerHTML = '<span class="icon icon-save"></span> Update Routine';
            
            updateBuilderExercisesList();
        } catch (error) {
            console.error('Error editing routine:', error);
            showToast('Error', 'Failed to load routine for editing');
        }
    }
    
    /**
     * Update the builder exercises list display
     */
    function updateBuilderExercisesList() {
        if (!builderExercises) {
            console.warn('Builder exercises container not found');
            return;
        }

        builderExercises.innerHTML = '';
        
        if (builderExercisesList.length === 0) {
            builderExercises.innerHTML = `
                <div class="empty-builder">
                    <p>No exercises added yet</p>
                    <a href="exercises.html" class="btn btn-outline">Browse Exercises</a>
                </div>
            `;
            return;
        }
        
        const exerciseList = document.createElement('div');
        exerciseList.className = 'exercise-list';
        
        builderExercisesList.forEach(exerciseId => {
            try {
                if (!exercises || !Array.isArray(exercises)) {
                    throw new Error('Exercises data not loaded');
                }

                const exercise = exercises.find(e => e.id === exerciseId);
                if (exercise) {
                    const exerciseItem = document.createElement('div');
                    exerciseItem.className = 'exercise-item';
                    exerciseItem.dataset.exerciseId = exercise.id;
                    
                    exerciseItem.innerHTML = `
                        <div class="exercise-info">
                            <h4>${escapeHtml(exercise.name)}</h4>
                            <span class="exercise-category ${escapeHtml(exercise.category)}">${escapeHtml(exercise.category)}</span>
                        </div>
                        <button class="btn-icon remove-exercise" title="Remove Exercise" aria-label="Remove ${escapeHtml(exercise.name)}">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="7" width="10" height="8" rx="2" fill="#F44336"/><rect x="8" y="9" width="1.5" height="5" fill="#fff"/><rect x="10.5" y="9" width="1.5" height="5" fill="#fff"/><rect x="4" y="5" width="12" height="2" fill="#BDBDBD"/></svg>
                        </button>
                    `;
                    
                    const removeBtn = exerciseItem.querySelector('.remove-exercise');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', () => {
                            builderExercisesList = builderExercisesList.filter(id => id !== exercise.id);
                            updateBuilderExercisesList();
                        });
                    }
                    
                    exerciseList.appendChild(exerciseItem);
                }
            } catch (error) {
                console.error('Error rendering exercise item:', error);
            }
        });
        
        builderExercises.appendChild(exerciseList);
    }
    
    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ============ INITIALIZATION ============
    
    /**
     * Handle adding exercises from the exercises page
     */
    function handleAddExercisesFromHash() {
        if (window.location.hash === '#add-exercises') {
            try {
                const params = new URLSearchParams(window.location.hash.substring(1));
                const exerciseIds = params.get('exerciseIds');
                
                if (exerciseIds) {
                    const ids = exerciseIds.split(',').filter(Boolean);
                    builderExercisesList = [...new Set([...builderExercisesList, ...ids])];
                    updateBuilderExercisesList();
                    switchToTab('routine-builder');
                    
                    // Clean up URL
                    history.replaceState(null, null, window.location.pathname);
                }
            } catch (error) {
                console.error('Error handling exercise add:', error);
            }
        }
    }
    handleAddExercisesFromHash();
});