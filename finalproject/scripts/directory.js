/**
 * Directory Page JavaScript Module
 * Handles filtering, view switching, and member display
 */

import { filterMembers, getAllMembers } from './data.js';
import { openModal } from './modal.js';

// State management
let currentCategory = 'all';
let currentTier = 'all';
let isGridView = true;
let allMembers = [];

// ============================================
// DOM ELEMENTS
// ============================================

const categoryFilter = document.getElementById('category-filter');
const tierFilter = document.getElementById('tier-filter');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const directoryContainer = document.getElementById('directory-container');
const resultsCount = document.getElementById('results-count');

// ============================================
// DISPLAY FUNCTIONS
// ============================================

/**
 * Display members in the directory
 * Uses template literals for HTML generation
 * @param {Array} members - Array of member objects
 */
function displayMembers(members) {
    if (members.length === 0) {
        directoryContainer.innerHTML = `
            <div class="no-results">
                <p>No members found matching your criteria.</p>
            </div>
        `;
        resultsCount.textContent = 'No members found';
        return;
    }

    // Use map() to generate HTML for each member
    const html = members.map(member => `
        <article class="member-card" data-member-id="${member.id}">
            <img src="${member.image}" 
                 alt="${member.name} logo" 
                 class="member-image" 
                 loading="lazy"
                 onerror="this.src='images/placeholder.jpg'">
            <div class="member-content">
                <span class="member-tier tier-${member.tier}">${member.tier}</span>
                <h3>${member.name}</h3>
                <p class="member-category">${formatCategory(member.category)}</p>
                <p class="member-description">${member.description}</p>
                <div class="member-contact">
                    <span>📞 ${member.phone}</span>
                </div>
            </div>
        </article>
    `).join('');

    directoryContainer.innerHTML = html;
    resultsCount.textContent = `Showing ${members.length} member${members.length !== 1 ? 's' : ''}`;

    // Add click handlers for modal
    directoryContainer.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('click', () => {
            const memberId = parseInt(card.dataset.memberId);
            const member = allMembers.find(m => m.id === memberId);
            if (member) openModal(member);
        });
    });
}

/**
 * Format category code to readable name
 * @param {string} category - Category code
 * @returns {string} Formatted category name
 */
function formatCategory(category) {
    const categories = {
        software: 'Software Development',
        hardware: 'Hardware & IoT',
        design: 'UI/UX Design',
        marketing: 'Digital Marketing',
        consulting: 'Tech Consulting',
        education: 'Tech Education'
    };
    return categories[category] || category;
}

// ============================================
// FILTERING
// ============================================

/**
 * Apply filters and update display
 * Uses async/await for data fetching
 */
async function applyFilters() {
    const filtered = await filterMembers(currentCategory, currentTier);
    displayMembers(filtered);
}

// ============================================
// VIEW TOGGLE
// ============================================

/**
 * Toggle between grid and list views
 */
function setGridView() {
    isGridView = true;
    directoryContainer.classList.remove('list-view');
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');

    // Save preference to localStorage
    localStorage.setItem('directoryView', 'grid');
}

function setListView() {
    isGridView = false;
    directoryContainer.classList.add('list-view');
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');

    // Save preference to localStorage
    localStorage.setItem('directoryView', 'list');
}

// ============================================
// EVENT HANDLERS
// ============================================

function initEventListeners() {
    // Category filter
    categoryFilter.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        applyFilters();
    });

    // Tier filter
    tierFilter.addEventListener('change', (e) => {
        currentTier = e.target.value;
        applyFilters();
    });

    // View toggles
    gridViewBtn.addEventListener('click', setGridView);
    listViewBtn.addEventListener('click', setListView);
}

// ============================================
// MOBILE MENU (Shared functionality)
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

document.addEventListener('DOMContentLoaded', async () => {
    initMobileMenu();
    updateFooterDates();
    initEventListeners();

    // Load saved view preference from localStorage
    const savedView = localStorage.getItem('directoryView');
    if (savedView === 'list') {
        setListView();
    }

    // Load all members
    allMembers = await getAllMembers();
    displayMembers(allMembers);
});