/**
 * Exercises Module
 * Handles exercise display, filtering, and interaction
 */

const ExercisesModule = {
    exerciseGrid: null,
    loadingSpinner: null,

    /**
     * Initialize the exercises module
     */
    init() {
        this.exerciseGrid = document.getElementById('exercise-grid');
        this.loadingSpinner = document.getElementById('loading-spinner');
        
        this.renderExercises(exercises);
        this.exposeGlobalFilter();
    },

    /**
     * Expose filter function globally for tab switching
     */
    exposeGlobalFilter() {
        window.filterExercises = (category) => {
            if (!exercises || !Array.isArray(exercises)) {
                console.error('Exercises data not loaded');
                return;
            }
            const filtered = category === 'all' 
                ? exercises 
                : exercises.filter(ex => ex.category === category);
            this.renderExercises(filtered);
        };
    },

    /**
     * Show loading spinner
     */
    showLoading() {
        if (this.loadingSpinner) this.loadingSpinner.style.display = 'flex';
    },

    /**
     * Hide loading spinner
     */
    hideLoading() {
        if (this.loadingSpinner) this.loadingSpinner.style.display = 'none';
    },

    /**
     * Render exercises to the grid
     * @param {Array} exercisesToRender - Array of exercise objects
     */
    renderExercises(exercisesToRender) {
        if (!this.exerciseGrid) return;

        this.showLoading();

        // Remove existing exercise cards but keep loading spinner
        Array.from(this.exerciseGrid.children)
            .filter(child => child.id !== 'loading-spinner')
            .forEach(child => child.remove());

        // Add exercise cards
        exercisesToRender.forEach(exercise => {
            const card = this.createExerciseCard(exercise);
            this.exerciseGrid.insertBefore(card, this.loadingSpinner);
        });

        this.hideLoading();
    },

    /**
     * Get media HTML for exercise
     * @param {Object} exercise - Exercise object
     * @returns {string} HTML for media element
     */
    getMediaHTML(exercise) {
        if (exercise.gif) {
            return `<img src="${exercise.gif}" alt="${exercise.name}" class="exercise-gif">`;
        } else if (exercise.image) {
            return `<img src="${exercise.image}" alt="${exercise.name}" class="exercise-image">`;
        }
        return '<div class="exercise-image placeholder"></div>';
    },

    /**
     * Get reps/duration info HTML
     * @param {Object} exercise - Exercise object
     * @returns {string} HTML for exercise specs
     */
    getRepsInfo(exercise) {
        return exercise.reps 
            ? `<p><strong>Reps:</strong> ${exercise.sets} sets of ${exercise.reps} reps</p>`
            : `<p><strong>Duration:</strong> ${exercise.duration} seconds per set</p>`;
    },

    /**
     * Create an exercise card element
     * @param {Object} exercise - Exercise object
     * @returns {HTMLElement} Exercise card element
     */
    createExerciseCard(exercise) {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.dataset.category = exercise.category;

        const media = this.getMediaHTML(exercise);
        const repsInfo = this.getRepsInfo(exercise);

        card.innerHTML = `
            <div class="card-collapsed">
                ${media}
                <div class="exercise-info">
                    <div class="exercise-header">
                        <h3>${exercise.name}</h3>
                        <span class="exercise-category ${exercise.category}">${exercise.category}</span>
                    </div>
                    <p class="exercise-description">${exercise.description}</p>
                    <div class="exercise-details">
                        ${repsInfo}
                    </div>
                </div>
            </div>
            <div class="card-expanded" style="display: none;">
                ${exercise.gif ? `<img src="${exercise.gif}" alt="${exercise.name}" class="exercise-gif">` : ''}
                <div class="exercise-actions">
                    <button class="btn btn-outline view-instructions" data-exercise-id="${exercise.id}">View Instructions</button>
                    <button class="btn btn-primary add-to-routine" data-exercise-id="${exercise.id}">Add to Routine</button>
                </div>
            </div>
        `;

        // Add event listeners
        this.attachCardEventListeners(card, exercise);

        return card;
    },

    /**
     * Attach event listeners to exercise card
     * @param {HTMLElement} card - Card element
     * @param {Object} exercise - Exercise object
     */
    attachCardEventListeners(card, exercise) {
        // Toggle card expansion
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.exercise-actions')) {
                this.toggleCardExpansion(card);
            }
        });

        // View instructions button
        const viewBtn = card.querySelector('.view-instructions');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showExerciseModal(exercise);
            });
        }

        // Add to routine button
        const addBtn = card.querySelector('.add-to-routine');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAddToRoutine(exercise);
            });
        }
    },

    /**
     * Toggle card expansion state
     * @param {HTMLElement} card - Card element
     */
    toggleCardExpansion(card) {
        const isExpanded = card.classList.toggle('expanded');
        const collapsed = card.querySelector('.card-collapsed');
        const expanded = card.querySelector('.card-expanded');

        if (isExpanded) {
            collapsed.style.display = 'none';
            expanded.style.display = 'block';
        } else {
            collapsed.style.display = 'flex';
            expanded.style.display = 'none';
        }
    },

    /**
     * Handle adding exercise to routine
     * @param {Object} exercise - Exercise object
     */
    handleAddToRoutine(exercise) {
        if (typeof db === 'undefined' || typeof db.addExerciseToRoutine !== 'function') {
            showToast('Error', 'Routine database is not available.');
            return;
        }

        let routines = db.getRoutines();
        
        if (!Array.isArray(routines)) {
            showToast('Error', 'Unable to load routines.');
            return;
        }
        
        let routineId;

        if (!routines.length) {
            const newRoutine = db.createRoutine('My Routine', []);
            routineId = newRoutine.id;
            showToast('Routine Created', 'A new routine was created for you.');
        } else {
            routineId = routines[0].id;
        }

        const success = db.addExerciseToRoutine(routineId, exercise.id);
        const message = success 
            ? `${exercise.name} has been added to your routine`
            : `${exercise.name} is already in your routine`;
        
        showToast(
            success ? 'Exercise Added' : 'Already Added',
            message
        );
    },

    /**
     * Show exercise details modal
     * @param {Object} exercise - Exercise object
     */
    showExerciseModal(exercise) {
        const modal = document.createElement('div');
        modal.className = 'modal';

        const specsHTML = exercise.reps 
            ? `<div class="spec"><h4>Reps</h4><p>${exercise.reps}</p></div>`
            : `<div class="spec"><h4>Duration</h4><p>${exercise.duration} sec</p></div>`;

        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2>${exercise.name}</h2>
                <p class="exercise-category ${exercise.category}">${exercise.category}</p>
                
                ${exercise.gif ? `<img src="${exercise.gif}" alt="${exercise.name}" class="exercise-gif">` : ''}
                ${exercise.image ? `<img src="${exercise.image}" alt="${exercise.name}" class="modal-exercise-image">` : ''}
                
                <div class="modal-exercise-details">
                    <h3>Description</h3>
                    <p>${exercise.description}</p>
                    
                    <h3>Instructions</h3>
                    <div class="instructions">${Array.isArray(exercise.instructions) ? exercise.instructions.join('<br>') : exercise.instructions.replace(/\n/g, '<br>')}</div>
                    
                    <div class="exercise-specs">
                        <div class="spec">
                            <h4>Sets</h4>
                            <p>${exercise.sets}</p>
                        </div>
                        ${specsHTML}
                    </div>
                </div>
                
                <button class="btn btn-primary add-to-routine" data-exercise-id="${exercise.id}">Add to Routine</button>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add('modal-open');

        this.attachModalEventListeners(modal, exercise);
    },

    /**
     * Attach event listeners to modal
     * @param {HTMLElement} modal - Modal element
     * @param {Object} exercise - Exercise object
     */
    attachModalEventListeners(modal, exercise) {
        const closeModal = () => {
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
        };

        // Close button
        modal.querySelector('.modal-close').addEventListener('click', closeModal);

        // Add to routine button
        const addBtn = modal.querySelector('.add-to-routine');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.handleAddToRoutine(exercise);
            });
        }

        // Close when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    ExercisesModule.init();
});