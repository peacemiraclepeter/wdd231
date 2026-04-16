/**
 * Join Page JavaScript Module
 * Handles form interactions and tier selection
 */

// ============================================
// TIER SELECTION
// ============================================

/**
 * Initialize tier card selection
 */
function initTierSelection() {
    const tierCards = document.querySelectorAll('.tier-card');
    const tierSelect = document.getElementById('tier');

    tierCards.forEach(card => {
        const selectBtn = card.querySelector('.btn-select');

        selectBtn.addEventListener('click', () => {
            const tier = card.dataset.tier;

            // Update select dropdown
            if (tierSelect) {
                tierSelect.value = tier;
            }

            // Visual feedback
            tierCards.forEach(c => c.style.borderColor = '');
            card.style.borderColor = 'var(--color-orange)';

            // Save to localStorage
            localStorage.setItem('selectedTier', tier);

            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Check for saved tier preference
    const savedTier = localStorage.getItem('selectedTier');
    if (savedTier && tierSelect) {
        tierSelect.value = savedTier;
        const savedCard = document.querySelector(`.tier-card[data-tier="${savedTier}"]`);
        if (savedCard) {
            savedCard.style.borderColor = 'var(--color-orange)';
        }
    }
}

// ============================================
// FORM HANDLING
// ============================================

/**
 * Initialize form functionality
 */
function initForm() {
    const form = document.getElementById('join-form');

    if (!form) return;

    // Form validation enhancement
    form.addEventListener('submit', (e) => {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '';
            }
        });

        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all required fields.');
        }
    });

    // Clear error styling on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            field.style.borderColor = '';
        });
    });

    // Save form progress to localStorage
    const formInputs = form.querySelectorAll('input, select, textarea');

    formInputs.forEach(input => {
        // Load saved value
        const savedValue = localStorage.getItem(`form_${input.name}`);
        if (savedValue && input.type !== 'radio' && input.type !== 'checkbox') {
            input.value = savedValue;
        }

        // Save on change
        input.addEventListener('change', () => {
            if (input.type !== 'radio' && input.type !== 'checkbox') {
                localStorage.setItem(`form_${input.name}`, input.value);
            }
        });
    });

    // Clear saved data on successful submit (handled on thankyou page)
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
    initTierSelection();
    initForm();
});