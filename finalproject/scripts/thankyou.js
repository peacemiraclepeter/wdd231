/**
 * Thank You Page JavaScript Module
 * Displays form submission data from URL parameters
 */

// ============================================
// URL PARAMETER HANDLING
// ============================================

/**
 * Get URL search parameters
 * @returns {URLSearchParams} URL parameters
 */
function getUrlParams() {
    return new URLSearchParams(window.location.search);
}

/**
 * Format form field name for display
 * @param {string} name - Field name
 * @returns {string} Formatted name
 */
function formatFieldName(name) {
    return name
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format field value for display
 * @param {string} name - Field name
 * @param {string} value - Field value
 * @returns {string} Formatted value
 */
function formatFieldValue(name, value) {
    if (name === 'tier') {
        const tiers = {
            'np': 'Non-Profit (Free)',
            'bronze': 'Bronze (₦10,000/month)',
            'silver': 'Silver (₦25,000/month)',
            'gold': 'Gold (₦50,000/month)'
        };
        return tiers[value] || value;
    }

    if (name === 'category') {
        const categories = {
            'software': 'Software Development',
            'hardware': 'Hardware & IoT',
            'design': 'UI/UX Design',
            'marketing': 'Digital Marketing',
            'consulting': 'Tech Consulting',
            'education': 'Tech Education',
            'other': 'Other'
        };
        return categories[value] || value;
    }

    if (name === 'newsletter' || name === 'sms') {
        return value === 'yes' ? 'Yes' : 'No';
    }

    return value;
}

/**
 * Display form data from URL parameters
 * Uses template literals and array methods
 */
function displayFormData() {
    const container = document.getElementById('form-data-display');
    const params = getUrlParams();

    if (!container || params.toString() === '') {
        container.innerHTML = '<p>No form data found.</p>';
        return;
    }

    // Convert params to array and map to HTML
    const html = Array.from(params.entries())
        .filter(([key]) => key !== 'submit') // Exclude submit button
        .map(([key, value]) => `
            <div class="data-row">
                <span class="data-label">${formatFieldName(key)}:</span>
                <span>${formatFieldValue(key, value)}</span>
            </div>
        `).join('');

    container.innerHTML = html || '<p>No data submitted.</p>';

    // Clear saved form data from localStorage
    clearSavedFormData(params);
}

/**
 * Clear saved form data from localStorage
 * @param {URLSearchParams} params - Submitted params
 */
function clearSavedFormData(params) {
    Array.from(params.keys()).forEach(key => {
        localStorage.removeItem(`form_${key}`);
    });
    localStorage.removeItem('selectedTier');
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNav.classList.toggle('open');
        });
    }
}

// ============================================
// FOOTER DATES
// ============================================

function updateFooterDates() {
    const yearSpan = document.getElementById('current-year');
    const modifiedSpan = document.getElementById('last-modified');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (modifiedSpan) {
        modifiedSpan.textContent = document.lastModified;
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    updateFooterDates();
    displayFormData();
});