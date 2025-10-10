# Contributing to PhysioRoutine

First off, thank you for considering contributing to PhysioRoutine! It's people like you that make PhysioRoutine such a great tool. This is an open source project by [Gurkha Technology](http://www.gurkhatech.com/).

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Style Guide](#javascript-style-guide)
  - [CSS Style Guide](#css-style-guide)
- [Project Structure](#project-structure)
- [Future Roadmap](#future-roadmap)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for PhysioRoutine. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**
- Check the [documentation](documentation.md) to see if the behavior is expected
- Check if the issue has already been reported by searching existing issues
- Try to isolate the problem and provide steps to reproduce

**How Do I Submit A Good Bug Report?**

Bugs are tracked as [GitHub issues](https://github.com/GurkhaTechnology/phyisio-routine/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots** if relevant
- **Specify your browser** and operating system

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for PhysioRoutine, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion:**
- Check the [roadmap](plan.md) to see if it's already planned
- Search existing issues to see if the enhancement has already been suggested

**How Do I Submit A Good Enhancement Suggestion?**

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate how the enhancement would be used
- **Describe the current behavior** and explain which behavior you expected to see instead
- **Explain why this enhancement would be useful** to most PhysioRoutine users

### Pull Requests

The process described here has several goals:
- Maintain PhysioRoutine's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible PhysioRoutine
- Enable a sustainable system for PhysioRoutine's maintainers to review contributions

**Pull Request Process:**

1. **Fork the repository** and create your branch from `main`
   ```sh
   git checkout -b feature/AmazingFeature
   ```

2. **Make your changes:**
   - Write clear, commented code when necessary
   - Follow the existing code style
   - Update documentation if you're changing functionality
   - Add your changes to the appropriate section

3. **Test your changes:**
   - Open `index.html` in multiple browsers to ensure compatibility
   - Test on both desktop and mobile viewports
   - Verify that existing functionality still works
   - Check the browser console for any errors

4. **Commit your changes:**
   ```sh
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to your fork:**
   ```sh
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request:**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Explain why this change is needed

## Development Setup

PhysioRoutine is a vanilla JavaScript application with no build process or dependencies. Getting started is simple:

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A text editor or IDE
- Git for version control

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/GurkhaTechnology/phyisio-routine.git
   ```

2. Navigate to the project directory:
   ```sh
   cd phyisio-routine
   ```

3. Open `index.html` in your browser:
   - You can simply double-click the file
   - Or use a local development server:
     ```sh
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

4. Start making changes!

### Project Structure

```
/phyisio-routine
|-- css/
|   |-- styles.css         # Core styles, typography, layout
|   |-- components.css     # Component-specific styles
|-- js/
|   |-- app.js             # General application logic
|   |-- auth.js            # Admin authentication
|   |-- data.js            # Initial exercise data
|   |-- db.js              # localStorage wrapper
|   |-- exercises.js       # Exercise library page logic
|   |-- progress.js        # Progress tracking page logic
|   |-- routines.js        # Routines page logic
|   |-- service-worker.js  # Offline support
|   |-- ui.js              # UI component management
|-- images/                # Exercise demonstration GIFs
|-- *.html                 # HTML pages
|-- README.md              # Project overview
|-- documentation.md       # Technical documentation
|-- plan.md                # Future roadmap
|-- CONTRIBUTING.md        # This file
```

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

**Examples:**
```
Add search functionality to exercise library
Fix progress tracking for completed routines
Update documentation for admin panel
```

### JavaScript Style Guide

- Use ES6+ features (const/let, arrow functions, template literals)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Avoid global variables when possible
- Use consistent indentation (2 or 4 spaces)

**Example:**
```javascript
// Good
const calculateStreakDays = (activities) => {
  let streak = 0;
  // Logic here
  return streak;
};

// Avoid
function calc(a) {
  var x = 0;
  // ...
}
```

### CSS Style Guide

- Use custom properties (CSS variables) for theming
- Follow mobile-first responsive design
- Use BEM-like naming conventions for classes
- Group related properties together
- Add comments for complex selectors

**Example:**
```css
/* Good */
.exercise-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.exercise-card__title {
  font-size: 1.2rem;
  color: var(--text-primary);
}
```

### HTML Style Guide

- Use semantic HTML5 elements
- Add appropriate ARIA labels for accessibility
- Keep markup clean and readable
- Use consistent indentation

## Future Roadmap

Before working on a new feature, please check the [project roadmap](plan.md) to see what's planned:

**Short-term (1-3 months):**
- Backend integration with user accounts
- Enhanced UI/UX features
- Code quality improvements

**Mid-term (3-6 months):**
- Advanced progress analytics
- Community features and routine sharing
- Push notifications

**Long-term (6+ months):**
- AI-powered recommendations
- Therapist portal
- Mobile applications

## Getting Help

If you need help or have questions:

- Check the [documentation](documentation.md)
- Browse [existing issues](https://github.com/GurkhaTechnology/phyisio-routine/issues)
- Create a new issue with the "question" label
- Visit [www.gurkhatech.com](http://www.gurkhatech.com/) for more information about Gurkha Technology

## Recognition

Contributors will be recognized in the project. We appreciate all contributions, whether they're:
- Code improvements
- Bug reports
- Feature suggestions
- Documentation updates
- Design improvements
- Community support

Thank you for contributing to PhysioRoutine! 🎉
