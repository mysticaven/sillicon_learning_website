// Silicon Vault - Interactive Learning Platform
// Progress tracking, search, and accordion functionality

class SiliconVault {
    constructor() {
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.setupAccordion();
        this.setupSearch();
        this.setupProgressTracking();
        this.setupThemeToggle();
        this.updateAllProgress();
        this.setupSmoothScroll();
    }

    // Accordion functionality
    setupAccordion() {
        const accordionBtns = document.querySelectorAll('.accordion-btn');

        accordionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Don't trigger if clicking checkbox
                if (e.target.closest('.checkbox-container')) return;

                const item = btn.closest('.accordion-item');
                const content = item.querySelector('.accordion-content');
                const icon = btn.querySelector('.fa-chevron-down');

                // Toggle active state
                const isActive = item.classList.contains('active');

                if (isActive) {
                    // Close
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                    icon.style.transform = "rotate(0deg)";
                } else {
                    // Open
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.style.transform = "rotate(180deg)";
                }
            });
        });
    }

    // Search functionality
    setupSearch() {
        const searchBox = document.getElementById('searchBox');
        const items = document.querySelectorAll('.accordion-item');
        const searchCount = document.getElementById('searchCount');
        const totalQuestions = items.length;

        searchBox.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            items.forEach(item => {
                const text = item.innerText.toLowerCase();

                if (term === '' || text.includes(term)) {
                    item.style.display = "block";
                    visibleCount++;
                } else {
                    item.style.display = "none";
                }
            });

            // Update search count
            if (term === '') {
                searchCount.textContent = '';
            } else {
                searchCount.textContent = `${visibleCount}/${totalQuestions}`;
            }

            // Show/hide category groups based on visible items
            this.updateCategoryVisibility();
        });

        // Initial count display
        searchCount.textContent = '';
    }

    updateCategoryVisibility() {
        const categoryGroups = document.querySelectorAll('.category-group');

        categoryGroups.forEach(group => {
            const visibleItems = group.querySelectorAll('.accordion-item[style*="display: block"], .accordion-item:not([style*="display"])');

            if (visibleItems.length === 0) {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        });
    }

    // Progress tracking
    setupProgressTracking() {
        const checkboxes = document.querySelectorAll('.question-checkbox');

        checkboxes.forEach(checkbox => {
            const questionId = checkbox.closest('.accordion-item').dataset.id;

            // Set initial state from saved progress
            if (this.progress[questionId]) {
                checkbox.checked = true;
            }

            // Listen for changes
            checkbox.addEventListener('change', (e) => {
                this.progress[questionId] = e.target.checked;
                this.saveProgress();
                this.updateAllProgress();

                // Add celebration animation for completion
                if (e.target.checked) {
                    this.celebrateCompletion(checkbox);
                }
            });
        });

        // Reset progress button
        const resetBtn = document.getElementById('resetProgress');
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                this.resetProgress();
            }
        });
    }

    celebrateCompletion(checkbox) {
        const item = checkbox.closest('.accordion-item');
        item.style.transition = 'transform 0.3s ease';
        item.style.transform = 'scale(1.02)';

        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 300);
    }

    updateAllProgress() {
        // Calculate overall progress
        const totalQuestions = document.querySelectorAll('.question-checkbox').length;
        const completedQuestions = Object.values(this.progress).filter(v => v).length;
        const overallPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

        // Update overall progress circle
        this.updateProgressCircle(overallPercentage);

        // Update category progress
        this.updateCategoryProgress('logic', 5);
        this.updateCategoryProgress('arch', 3);
        this.updateCategoryProgress('python', 2);
        this.updateCategoryProgress('programming', 3);
    }

    updateProgressCircle(percentage) {
        const circle = document.getElementById('overallProgressCircle');
        const percentageText = document.getElementById('overallPercentage');
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDashoffset = offset;
        percentageText.textContent = `${percentage}%`;
    }

    updateCategoryProgress(category, totalQuestions) {
        const categoryGroup = document.querySelector(`[data-category="${category}"]`);
        if (!categoryGroup) return;

        const items = categoryGroup.querySelectorAll('.accordion-item');
        const completed = Array.from(items).filter(item => {
            const checkbox = item.querySelector('.question-checkbox');
            return checkbox && checkbox.checked;
        }).length;

        const percentage = totalQuestions > 0 ? Math.round((completed / totalQuestions) * 100) : 0;

        // Update progress bar
        const progressBar = document.getElementById(`${category}Progress`);
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        // Update count
        const countElement = document.getElementById(`${category}Count`);
        if (countElement) {
            countElement.textContent = `${completed}/${totalQuestions}`;
        }
    }

    // Local storage management
    loadProgress() {
        const saved = localStorage.getItem('siliconVaultProgress');
        return saved ? JSON.parse(saved) : {};
    }

    saveProgress() {
        localStorage.setItem('siliconVaultProgress', JSON.stringify(this.progress));
    }

    resetProgress() {
        this.progress = {};
        this.saveProgress();

        // Uncheck all checkboxes
        document.querySelectorAll('.question-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.updateAllProgress();

        // Show confirmation
        this.showNotification('Progress reset successfully!');
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Theme toggle (dark mode is default, could add light mode)
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        let isDark = true;

        themeToggle.addEventListener('click', () => {
            isDark = !isDark;

            if (isDark) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                // Dark mode is default, no changes needed
            } else {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                // Could implement light mode here
                this.showNotification('Light mode coming soon! 🌞');
            }
        });
    }

    // Smooth scroll for navigation
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));

                if (target) {
                    const offset = 100; // Account for sticky nav
                    const targetPosition = target.offsetTop - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchBox').focus();
    }

    // Escape to clear search
    if (e.key === 'Escape') {
        const searchBox = document.getElementById('searchBox');
        if (searchBox.value) {
            searchBox.value = '';
            searchBox.dispatchEvent(new Event('input'));
        }
    }
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SiliconVault();
    });
} else {
    new SiliconVault();
}

// Export for potential future use
window.SiliconVault = SiliconVault;
