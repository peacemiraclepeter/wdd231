/**
 * Miracle Tech Hub - Main JavaScript Module
 * Handles home page functionality: weather API, events, spotlights
 */

import { getFeaturedMembers, getUpcomingEvents } from './data.js';
import { openModal } from './modal.js';

// ============================================
// WEATHER API FUNCTIONALITY
// ============================================

const WEATHER_API_KEY = '55baebb84245984edb3ee618bd69de88'; // Replace with actual OpenWeatherMap API key
const CITY_LAT = 4.8156; // Port Harcourt latitude
const CITY_LON = 7.0498; // Port Harcourt longitude

/**
 * Fetch weather data from OpenWeatherMap API
 * Uses async/await with try...catch for error handling
 */
async function fetchWeatherData() {
    const weatherCard = document.getElementById('weather-card');

    try {
        // Using OpenWeatherMap API
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${CITY_LAT}&lon=${CITY_LON}&units=metric&appid=${WEATHER_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        displayWeather(data);

        // Store in localStorage for offline access
        localStorage.setItem('weatherData', JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));

    } catch (error) {
        console.error('Error fetching weather:', error);

        // Try to use cached data
        const cached = localStorage.getItem('weatherData');
        if (cached) {
            const { data } = JSON.parse(cached);
            displayWeather(data, true);
        } else {
            weatherCard.innerHTML = `
                <div class="weather-error">
                    <p>Unable to load weather data</p>
                    <small>Please check your connection</small>
                </div>
            `;
        }
    }
}

/**
 * Display weather data in the DOM
 * @param {Object} data - Weather API response data
 * @param {boolean} isCached - Whether data is from cache
 */
function displayWeather(data, isCached = false) {
    const weatherCard = document.getElementById('weather-card');
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const html = `
        ${isCached ? '<small style="opacity: 0.7;">(Cached data)</small>' : ''}
        <div class="weather-main">
            <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
            <div class="weather-temp">${Math.round(data.main.temp)}°C</div>
        </div>
        <div class="weather-desc">${data.weather[0].description}</div>
        <div class="weather-details">
            <div class="weather-detail">
                <span>Humidity</span>
                <strong>${data.main.humidity}%</strong>
            </div>
            <div class="weather-detail">
                <span>Wind</span>
                <strong>${data.wind.speed} m/s</strong>
            </div>
            <div class="weather-detail">
                <span>Feels Like</span>
                <strong>${Math.round(data.main.feels_like)}°C</strong>
            </div>
        </div>
    `;

    weatherCard.innerHTML = html;
}

// ============================================
// EVENTS DISPLAY
// ============================================

/**
 * Display upcoming events using template literals
 */
function displayEvents() {
    const container = document.getElementById('events-container');
    const events = getUpcomingEvents();

    const html = events.map(event => `
        <article class="event-card">
            <span class="event-date">${formatDate(event.date)}</span>
            <h3>${event.title}</h3>
            <p class="event-location">📍 ${event.location}</p>
            <p>${event.description}</p>
        </article>
    `).join('');

    container.innerHTML = html;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ============================================
// MEMBER SPOTLIGHTS
// ============================================

/**
 * Display random featured members (spotlights)
 */
function displaySpotlights() {
    const container = document.getElementById('spotlights-container');
    const members = getFeaturedMembers(3); // Get 3 random gold/silver members

    const html = members.map(member => `
        <article class="spotlight-card" data-member-id="${member.id}">
            <img src="${member.image}" alt="${member.name}" class="spotlight-image" loading="lazy">
            <div class="spotlight-content">
                <span class="spotlight-tier tier-${member.tier}">${member.tier}</span>
                <h3>${member.name}</h3>
                <p class="spotlight-category">${formatCategory(member.category)}</p>
                <p>${member.description.substring(0, 100)}...</p>
            </div>
        </article>
    `).join('');

    container.innerHTML = html;

    // Add click handlers for modal
    container.querySelectorAll('.spotlight-card').forEach(card => {
        card.addEventListener('click', () => {
            const memberId = parseInt(card.dataset.memberId);
            const member = members.find(m => m.id === memberId);
            if (member) openModal(member);
        });
    });
}

/**
 * Format category name for display
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
// ANIMATED STATS COUNTER
// ============================================

/**
 * Animate statistics numbers counting up
 */
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    if (stats.length === 0) return;

    // Check if element is in viewport
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));

                if (isNaN(target)) {
                    console.error('Invalid target value for stat:', stat);
                    return;
                }

                // Animate the counter
                animateCounter(stat, target);

                // Unobserve after animation starts
                observer.unobserve(stat);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

/**
 * Animate individual counter
 * @param {HTMLElement} element - The stat element
 * @param {number} target - Target number
 */
function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOutQuart);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }

    requestAnimationFrame(updateCounter);
}
// ============================================
// MOBILE MENU TOGGLE
// ============================================

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        primaryNav.classList.toggle('open');
    });
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
// LOCAL STORAGE - USER PREFERENCES
// ============================================

/**
 * Save user visit count and last visit
 */
function trackVisits() {
    let visits = parseInt(localStorage.getItem('visitCount') || '0');
    const lastVisit = localStorage.getItem('lastVisit');

    visits++;
    localStorage.setItem('visitCount', visits.toString());
    localStorage.setItem('lastVisit', new Date().toISOString());

    // Optional: Show welcome back message
    if (lastVisit && visits > 1) {
        const daysSince = Math.floor((Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 0) {
            console.log(`Welcome back! It's been ${daysSince} days since your last visit.`);
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    updateFooterDates();
    trackVisits();

    // Load dynamic content
    fetchWeatherData();
    displayEvents();
    displaySpotlights();

    // Initialize stats animation with a slight delay to ensure DOM is ready
    setTimeout(animateStats, 100);
});