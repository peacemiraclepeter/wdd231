// W05 Chamber Discover Page
// Features: localStorage visit tracking, dynamic content from JSON, modal dialogs

import { attractions } from '../data/attractions.mjs';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    displayVisitMessage();
    renderAttractions();
});

// ==========================================
// localStorage Visit Message Functionality
// ==========================================
function displayVisitMessage() {
    const banner = document.getElementById('visit-message');
    const now = Date.now();
    const lastVisit = localStorage.getItem('discoverLastVisit');

    let message = '';
    let messageClass = '';

    if (!lastVisit) {
        // First visit
        message = 'Welcome! Let us know if you have any questions.';
        messageClass = 'new-visitor';
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const timeDiff = now - lastVisitDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (timeDiff < 86400000) { // Less than 1 day (24 hours)
            message = 'Back so soon! Awesome!';
            messageClass = 'recent-visitor';
        } else {
            // Days ago
            const dayWord = daysDiff === 1 ? 'day' : 'days';
            message = `You last visited ${daysDiff} ${dayWord} ago.`;
            messageClass = 'returning-visitor';
        }
    }

    // Store current visit
    localStorage.setItem('discoverLastVisit', now.toString());

    // Display message with close button
    banner.className = `visit-banner ${messageClass}`;
    banner.innerHTML = `
        ${message}
        <button class="close-banner" aria-label="Close message">×</button>
    `;

    // Close button functionality
    const closeBtn = banner.querySelector('.close-banner');
    closeBtn.addEventListener('click', () => {
        banner.style.display = 'none';
        // Store preference to not show again this session
        sessionStorage.setItem('bannerClosed', 'true');
    });

    // Check if user closed banner this session
    if (sessionStorage.getItem('bannerClosed') === 'true') {
        banner.style.display = 'none';
    }
}

// ==========================================
// Render Attractions from JSON
// ==========================================
function renderAttractions() {
    const grid = document.getElementById('attractions-grid');

    try {
        // Clear loading message
        grid.innerHTML = '';

        // Validate data
        if (!Array.isArray(attractions) || attractions.length === 0) {
            throw new Error('No attractions data available');
        }

        // Generate cards using template literals
        attractions.forEach((attraction, index) => {
            const card = createAttractionCard(attraction, index);
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading attractions:', error);
        grid.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #e74c3c;">
                <p>Unable to load attractions. Please try again later.</p>
                <p style="font-size: 0.9rem; color: #7f8c8d;">${error.message}</p>
            </div>
        `;
    }
}

// Create individual attraction card
function createAttractionCard(attraction, index) {
    const article = document.createElement('article');
    article.className = 'attraction-card';
    article.setAttribute('data-id', attraction.id);

    // Using template literal for HTML structure
    article.innerHTML = `
        <figure class="card-image">
            <img src="${attraction.image}" 
                 alt="${attraction.name}" 
                 width="300" 
                 height="200"
                 loading="lazy">
        </figure>
        <div class="card-content">
            <h2>${attraction.name}</h2>
            <address class="address">${attraction.address}</address>
            <p class="description">${attraction.description}</p>
            <button class="learn-more-btn" data-id="${attraction.id}">
                Learn More
            </button>
        </div>
    `;

    // Add click event for Learn More button
    const btn = article.querySelector('.learn-more-btn');
    btn.addEventListener('click', () => openAttractionModal(attraction));

    return article;
}

// ==========================================
// Modal Dialog for Learn More
// ==========================================
function openAttractionModal(attraction) {
    // Create modal if doesn't exist
    let modal = document.getElementById('attraction-modal');

    if (!modal) {
        modal = document.createElement('dialog');
        modal.id = 'attraction-modal';
        modal.className = 'attraction-modal';
        document.body.appendChild(modal);

        // Add modal styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .attraction-modal {
                padding: 0;
                border: none;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .attraction-modal::backdrop {
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(4px);
            }
            .modal-content {
                padding: 2rem;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #ecf0f1;
            }
            .modal-title {
                color: #1a5276;
                margin: 0;
                font-family: 'Roboto', sans-serif;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                color: #7f8c8d;
                transition: color 0.3s;
            }
            .modal-close:hover {
                color: #e74c3c;
            }
            .modal-body {
                line-height: 1.6;
            }
            .modal-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Populate modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">${attraction.name}</h3>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${attraction.image}" alt="${attraction.name}" class="modal-image">
                <p><strong>📍 Address:</strong> ${attraction.address}</p>
                <p style="margin-top: 1rem;">${attraction.description}</p>
                <p style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 6px;">
                    <strong>Visitor Tip:</strong> This is one of Port Harcourt's most popular destinations. 
                    We recommend visiting during weekdays for the best experience.
                </p>
            </div>
        </div>
    `;

    // Show modal
    modal.showModal();

    // Close button functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.close());

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom) {
            modal.close();
        }
    });

    // Trap focus for accessibility
    trapFocus(modal);
}

// Accessibility: Trap focus within modal
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Return focus to trigger when closed
    modal.addEventListener('close', () => {
        const trigger = document.querySelector(`[data-id="${modal.getAttribute('data-trigger')}"]`);
        if (trigger) trigger.focus();
    });
}