// admin.js
document.addEventListener('DOMContentLoaded', function() {
    const exerciseForm = document.getElementById('exercise-form');
    const nameInput = document.getElementById('exercise-name');
    const categoryInput = document.getElementById('exercise-category');
    const descInput = document.getElementById('exercise-description');
    const instructionsInput = document.getElementById('exercise-instructions');
    const setsInput = document.getElementById('exercise-sets');
    const repsInput = document.getElementById('exercise-reps');
    const durationInput = document.getElementById('exercise-duration');
    const imageInput = document.getElementById('exercise-image');
    const gifInput = document.getElementById('exercise-gif');

    // Helper: sanitize and normalize values
    function toInt(val) {
        const n = parseInt(val, 10);
        return Number.isNaN(n) ? null : n;
    }

    function normalizeUrl(val) {
        const url = (val || '').trim();
        return url.length ? url : null;
    }

    // Basic client-side validation feedback
    function showError(message) {
        if (window.showToast) {
            window.showToast('Validation error', message, 3500);
        } else {
            alert(message);
        }
    }

    if (exerciseForm) {
        exerciseForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = (nameInput.value || '').trim();
            const category = (categoryInput.value || '').trim();
            const description = (descInput.value || '').trim();
            const rawInstructions = (instructionsInput.value || '').trim();
            const sets = toInt(setsInput.value);
            const reps = toInt(repsInput.value);
            const duration = toInt(durationInput.value);
            const image = normalizeUrl(imageInput.value);
            const gif = normalizeUrl(gifInput.value);

            // Validate required fields
            if (!name) return showError('Please enter an exercise name.');
            if (!category) return showError('Please select a category.');
            if (!description) return showError('Please add a brief description.');
            if (!rawInstructions) return showError('Please add at least one instruction.');
            if (!sets || sets < 1) return showError('Sets must be 1 or more.');

            // Either reps or duration must be provided
            if (!reps && !duration) {
                return showError('Provide reps or duration for each set.');
            }

            // Normalize instructions: keep as string with newlines for consistency
            const instructions = rawInstructions
                .split(/\r?\n/)
                .map(s => s.trim())
                .filter(Boolean)
                .join('\n');

            // Prepare exercise object
            const exercise = {
                id: Date.now(),
                name,
                category,
                description,
                instructions,
                sets,
                reps: reps || null,
                duration: duration || null,
                image,
                gif
            };

            // Add to exercises array (in a real app, this would go to a database)
            exercises.push(exercise);

            // Update localStorage
            localStorage.setItem('physioExercises', JSON.stringify(exercises));

            // Success feedback
            if (window.showToast) {
                window.showToast('Exercise added', 'Your exercise was saved to the library.');
            } else {
                alert('Exercise added successfully!');
            }

            // Reset form
            exerciseForm.reset();
        });
    }

    // Load existing exercises from localStorage
    if (localStorage.getItem('physioExercises')) {
        const savedExercises = JSON.parse(localStorage.getItem('physioExercises'));
        exercises = savedExercises;
    }
});