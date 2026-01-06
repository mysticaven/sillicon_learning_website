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
        this.setupPopup();
        this.updateAllProgress();
        this.setupSmoothScroll();
        this.setupRoadmap();
        this.updatePlacementYear();
        this.setupVisitorStats();
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
        const logicCount = document.querySelectorAll('#logic .accordion-item').length;
        const archCount = document.querySelectorAll('#arch .accordion-item').length;
        const pythonCount = document.querySelectorAll('#coding .accordion-item').length;
        const progCount = document.querySelectorAll('[data-category="programming"] .accordion-item').length;

        this.updateCategoryProgress('logic', logicCount);
        this.updateCategoryProgress('arch', archCount);
        this.updateCategoryProgress('python', pythonCount);
        this.updateCategoryProgress('programming', progCount);
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

    // Follow Me Popup
    setupPopup() {
        const popup = document.getElementById('followPopup');
        const closeBtn = document.querySelector('.close-popup');

        // Use sessionStorage so it shows once per browsing session (tab/window)
        // If you want it on EVERY page load, remove the storage check entirely. 
        // Assuming "visiting website" means once per session to avoid checking it every refresh.
        const hasSeenSession = sessionStorage.getItem('siliconVaultPopupSeen');

        if (!hasSeenSession && popup) {
            // Show after 2 seconds
            setTimeout(() => {
                popup.classList.add('show');
            }, 2000);
        }

        if (popup && closeBtn) {
            closeBtn.addEventListener('click', () => {
                popup.classList.remove('show');
                sessionStorage.setItem('siliconVaultPopupSeen', 'true');
            });

            // Close when clicking outside
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.classList.remove('show');
                    sessionStorage.setItem('siliconVaultPopupSeen', 'true');
                }
            });
        }
    }

    // Roadmap Interaction
    setupRoadmap() {
        const cards = document.querySelectorAll('.phase-card.interactive');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent closing if clicking a link
                if (e.target.tagName === 'A' || e.target.closest('a')) return;

                // Close other cards
                cards.forEach(c => {
                    if (c !== card) c.classList.remove('active');
                });

                // Toggle current
                card.classList.toggle('active');
            });
        });
    }

    // Auto-update placement year
    updatePlacementYear() {
        const yearElement = document.getElementById('placement-year');
        if (yearElement) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth(); // 0-11

            // Placement season typically runs from July (month 6) to June
            // If current month is July or after, show current-next year
            // Otherwise show previous-current year
            let placementYear;
            if (currentMonth >= 6) {
                placementYear = `${currentYear}-${currentYear + 1}`;
            } else {
                placementYear = `${currentYear - 1}-${currentYear}`;
            }

            yearElement.textContent = placementYear;
        }
    }

    // Visitor Statistics
    setupVisitorStats() {
        const statsToggle = document.getElementById('visitorStatsToggle');
        const statsDropdown = document.getElementById('visitorStatsDropdown');
        const closeStats = document.getElementById('closeStats');

        // Toggle dropdown
        statsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            statsDropdown.classList.toggle('active');
        });

        // Close dropdown
        closeStats.addEventListener('click', () => {
            statsDropdown.classList.remove('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!statsDropdown.contains(e.target) && !statsToggle.contains(e.target)) {
                statsDropdown.classList.remove('active');
            }
        });

        // Initialize visitor tracking
        this.trackVisit();
    }

    async trackVisit() {
        try {
            // Check if this is a new session (to avoid counting same user multiple times)
            const lastVisit = sessionStorage.getItem('lastVisitTimestamp');
            const now = Date.now();

            // Only track if this is a new session (or more than 30 minutes since last count)
            const shouldTrack = !lastVisit || (now - parseInt(lastVisit)) > 1800000;

            if (shouldTrack) {
                // Get visitor's country using ipapi.co (free, no API key needed)
                const geoResponse = await fetch('https://ipapi.co/json/');
                const geoData = await geoResponse.json();

                // Extract country information
                const country = geoData.country_name || 'Unknown';
                const countryCode = geoData.country_code || 'XX';

                // Get flag emoji for the country
                const flag = this.getCountryFlag(countryCode);

                // Try to use Netlify Function first (for production)
                try {
                    const response = await fetch('/.netlify/functions/track-visit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            country,
                            countryCode,
                            flag
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        this.updateVisitorDisplay(data.totalVisitors);
                        this.updateCountriesDisplay(data.countries);
                        sessionStorage.setItem('lastVisitTimestamp', now.toString());
                        return;
                    }
                } catch (functionError) {
                    console.log('Netlify function not available, using fallback...', functionError);
                }

                // Fallback to CountAPI if Netlify function is not available (local development)
                this.fallbackAPITracking(country, countryCode, flag);
                sessionStorage.setItem('lastVisitTimestamp', now.toString());
            } else {
                // Just load existing data without tracking new visit
                this.loadVisitorStats();
            }

        } catch (error) {
            console.error('Error tracking visit:', error);
            // Final fallback to localStorage only
            this.fallbackLocalTracking();
        }
    }

    async loadVisitorStats() {
        try {
            // Try to load from Netlify Function
            const response = await fetch('/.netlify/functions/track-visit');
            if (response.ok) {
                const data = await response.json();
                this.updateVisitorDisplay(data.totalVisitors);
                this.updateCountriesDisplay(data.countries);
                return;
            }
        } catch (error) {
            console.log('Loading stats from fallback sources...');
        }

        // Fallback to CountAPI for global count
        try {
            const namespace = 'silicon-vault';
            const key = 'total-visitors';
            const countResponse = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`);
            const countData = await countResponse.json();
            this.updateVisitorDisplay(countData.value || 0);
        } catch (error) {
            console.error('Error loading visitor count:', error);
        }

        // Load countries from localStorage
        const countriesData = this.getCountriesData();
        this.updateCountriesDisplay(countriesData);
    }

    async fallbackAPITracking(country, countryCode, flag) {
        // Use CountAPI for global visitor counting (fallback for local development)
        const namespace = 'silicon-vault';
        const key = 'total-visitors';

        try {
            const countResponse = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
            const countData = await countResponse.json();
            this.updateVisitorDisplay(countData.value);
        } catch (error) {
            console.error('CountAPI error:', error);
        }

        // Store country visit in localStorage
        this.recordCountryVisit(country, countryCode, flag);
    }

    getCountryFlag(countryCode) {
        // Convert country code to flag emoji
        if (!countryCode || countryCode === 'XX') return '🌍';

        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    recordCountryVisit(countryName, countryCode, flag) {
        // Get existing country data from localStorage
        const countriesData = this.getCountriesData();

        // Check if this is a new session (to avoid counting same user multiple times)
        const lastVisit = sessionStorage.getItem('lastVisitTimestamp');
        const now = Date.now();

        // Only count if this is a new session (or more than 30 minutes since last count)
        if (!lastVisit || (now - parseInt(lastVisit)) > 1800000) {
            if (!countriesData[countryCode]) {
                countriesData[countryCode] = {
                    name: countryName,
                    flag: flag,
                    count: 0
                };
            }

            countriesData[countryCode].count++;

            // Save updated data
            localStorage.setItem('visitorCountries', JSON.stringify(countriesData));
            sessionStorage.setItem('lastVisitTimestamp', now.toString());
        }

        // Update the countries display
        this.updateCountriesDisplay(countriesData);
    }

    getCountriesData() {
        const saved = localStorage.getItem('visitorCountries');
        return saved ? JSON.parse(saved) : {};
    }

    updateVisitorDisplay(totalVisitors) {
        // Update badge
        const badge = document.getElementById('visitorCountBadge');
        if (badge) {
            badge.textContent = totalVisitors > 999 ? '999+' : totalVisitors;
        }

        // Update total visitors in dropdown
        const totalElement = document.getElementById('totalVisitors');
        if (totalElement) {
            totalElement.textContent = totalVisitors.toLocaleString();
        }
    }

    updateCountriesDisplay(countriesData) {
        const countriesList = document.getElementById('countriesList');
        if (!countriesList) return;

        // Sort countries by count (descending)
        const sortedCountries = Object.entries(countriesData)
            .map(([code, data]) => ({ code, ...data }))
            .sort((a, b) => b.count - a.count);

        if (sortedCountries.length === 0) {
            countriesList.innerHTML = '<div class="no-data">No country data yet...</div>';
            return;
        }

        // Build HTML for countries list
        const html = sortedCountries.map(country => `
            <div class="country-item">
                <div class="country-name">
                    <span class="country-flag">${country.flag}</span>
                    <span>${country.name}</span>
                </div>
                <div class="country-count">${country.count}</div>
            </div>
        `).join('');

        countriesList.innerHTML = html;
    }

    fallbackLocalTracking() {
        // Final fallback if all APIs fail
        const fallbackCount = localStorage.getItem('fallbackVisitorCount') || '0';
        const newCount = parseInt(fallbackCount) + 1;
        localStorage.setItem('fallbackVisitorCount', newCount.toString());

        this.updateVisitorDisplay(newCount);

        // Try to get basic country info from browser language
        const language = navigator.language || 'en-US';
        const countryCode = language.split('-')[1] || 'XX';
        const flag = this.getCountryFlag(countryCode);

        this.recordCountryVisit('Unknown', countryCode, flag);
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
