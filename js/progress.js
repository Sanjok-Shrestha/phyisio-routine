/**
 * Progress Page Module
 * Handles progress tracking display including stats and recent activity
 * Provides visualization of user workout streaks, activity levels, and completion history
 */

/**
 * DOM Elements cache and configuration
 */
const ProgressPage = {
    statsGrid: null,
    recentActivity: null,
    loadingSpinner: null,

    // Configuration constants
    CONFIG: {
        ACTIVITY_LIMIT: 5,
        STAT_CARD_CLASS: 'stat-card',
        ACTIVITY_ITEM_CLASS: 'activity-item'
    },

    /**
     * Initialize cached DOM elements
     * @returns {boolean} True if all required elements were found
     */
    initElements() {
        this.statsGrid = document.getElementById('stats-grid');
        this.recentActivity = document.getElementById('recent-activity');
        this.loadingSpinner = document.getElementById('progress-loading');

        // Validate that required elements exist
        if (!this.statsGrid || !this.recentActivity) {
            console.warn('Required DOM elements not found for progress page');
            return false;
        }
        return true;
    },

    /**
     * Show loading spinner
     * @private
     */
    showLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'flex';
        }
    },

    /**
     * Hide loading spinner
     * @private
     */
    hideLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'none';
        }
    },

    /**
     * Display an error message to the user
     * @param {string} message - The error message to display
     * @param {HTMLElement} container - The container to display the error in
     * @private
     */
    showError(message, container) {
        if (container) {
            container.innerHTML = `<div class="error-message"><p>${this.escapeHtml(message)}</p></div>`;
        }
    },

    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     * @private
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Render statistics cards
     * Displays metrics like active days, completed routines, duration, and current streak
     * @private
     */
    renderStats() {
        if (!this.statsGrid) return;

        try {
            // Validate database module is available
            if (typeof db === 'undefined' || typeof db.getProgressStats !== 'function') {
                throw new Error('Database module not loaded');
            }

            const stats = db.getProgressStats();
            
            // Validate stats object has required properties
            if (!stats || typeof stats !== 'object') {
                throw new Error('Invalid stats data');
            }

            const statCards = [
                { value: stats.activeDays7 || 0, label: 'Active Days (7d)' },
                { value: stats.activeDays30 || 0, label: 'Active Days (30d)' },
                { value: stats.routines7 || 0, label: 'Routines (7d)' },
                { value: stats.routines30 || 0, label: 'Routines (30d)' },
                { value: stats.duration7 || 0, label: 'Minutes (7d)' },
                { value: stats.duration30 || 0, label: 'Minutes (30d)' },
                { value: stats.currentStreak || 0, label: 'Current Streak' }
            ];

            this.statsGrid.innerHTML = statCards
                .map(card => `
                    <div class="${this.CONFIG.STAT_CARD_CLASS}">
                        <h3>${this.escapeHtml(String(card.value))}</h3>
                        <p>${this.escapeHtml(card.label)}</p>
                    </div>
                `)
                .join('');
        } catch (error) {
            console.error('Error rendering stats:', error);
            this.showError('Unable to load statistics.', this.statsGrid);
        }
    },

    /**
     * Render recent activity list
     * Displays the most recent routine completions
     * @private
     */
    renderRecentActivity() {
        if (!this.recentActivity) return;

        try {
            // Validate database module is available
            if (typeof db === 'undefined' || typeof db.getRecentActivity !== 'function') {
                throw new Error('Database module not loaded');
            }

            const activity = db.getRecentActivity(this.CONFIG.ACTIVITY_LIMIT);

            // Validate activity data
            if (!Array.isArray(activity)) {
                throw new Error('Invalid activity data');
            }

            if (activity.length === 0) {
                this.recentActivity.innerHTML = '<p class="empty-state">No recent activity yet. Start a routine to see your progress!</p>';
                return;
            }

            this.recentActivity.innerHTML = activity
                .filter(a => a && typeof a === 'object')
                .map(a => this.createActivityItem(a))
                .join('');
        } catch (error) {
            console.error('Error rendering recent activity:', error);
            this.showError('Unable to load recent activity.', this.recentActivity);
        }
    },

    /**
     * Create HTML for a single activity item
     * @param {Object} activity - Activity object with routineName, completedAt, and duration
     * @returns {string} HTML string for the activity item
     * @private
     */
    createActivityItem(activity) {
        // Validate activity object
        if (!activity || typeof activity !== 'object') {
            return '';
        }

        const routineName = activity.routineName || 'Unknown Routine';
        const duration = activity.duration || 0;
        
        let dateString = 'Unknown Date';
        try {
            const date = new Date(activity.completedAt);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            dateString = date.toLocaleString();
        } catch (error) {
            console.warn('Invalid date in activity:', error);
        }

        return `
            <div class="${this.CONFIG.ACTIVITY_ITEM_CLASS}">
                <strong>${this.escapeHtml(routineName)}</strong> - <span class="activity-date">${this.escapeHtml(dateString)}</span><br>
                <span class="activity-duration">Duration: ${this.escapeHtml(String(duration))} min</span>
            </div>
        `;
    },

    /**
     * Initialize and render the progress page
     * @returns {boolean} True if initialization was successful
     */
    init() {
        try {
            // Initialize DOM elements
            if (!this.initElements()) {
                console.error('Failed to initialize progress page: required DOM elements not found');
                return false;
            }

            this.showLoading();
            this.renderStats();
            this.renderRecentActivity();
            this.hideLoading();
            
            return true;
        } catch (error) {
            console.error('Error initializing progress page:', error);
            this.hideLoading();
            return false;
        }
    }
};

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        ProgressPage.init();
    });
} else {
    // DOM is already loaded
    ProgressPage.init();
}
