// WDD 231 Week 03 - Member Spotlights
// Displays 2-3 random gold or silver members

const membersURL = 'data/members.json';

document.addEventListener('DOMContentLoaded', () => {
    loadSpotlights();
});

// Async function to fetch and display spotlights
async function loadSpotlights() {
    try {
        const response = await fetch(membersURL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter for gold (3) and silver (2) members only
        const eligibleMembers = data.members.filter(member =>
            member.membershipLevel === 3 || member.membershipLevel === 2
        );

        // Randomly select 2 or 3 members
        const spotlightCount = Math.random() > 0.5 ? 3 : 2;
        const selectedMembers = getRandomMembers(eligibleMembers, spotlightCount);

        displaySpotlights(selectedMembers);

    } catch (error) {
        console.error('Spotlight fetch error:', error);
        displaySpotlightError();
    }
}

// Get random members from array
function getRandomMembers(members, count) {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Display spotlight cards
function displaySpotlights(members) {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';

    members.forEach(member => {
        const card = createSpotlightCard(member);
        container.appendChild(card);
    });
}

// Create individual spotlight card
function createSpotlightCard(member) {
    const card = document.createElement('div');
    card.className = 'spotlight-card';

    // Determine level
    const isGold = member.membershipLevel === 3;
    const levelText = isGold ? 'Gold Member' : 'Silver Member';
    const levelClass = isGold ? 'gold' : 'silver';

    // Handle image path
    const imagePath = member.image.startsWith('http')
        ? member.image
        : `images/members/${member.image}`;

    card.innerHTML = `
        <div class="member-image-wrapper">
            <img src="${member.image}" 
                 alt="${member.name} logo" 
                 loading="lazy"
                 onerror="this.src='images/placeholder.jpg'; this.alt='Image not available';">
        </div>
        <div class="spotlight-content">
            <h3>${member.name}</h3>
            <span class="spotlight-level ${levelClass}">${levelText}</span>
            <p>${member.description}</p>
            <p>📍 ${member.address}</p>
            <p>📞 ${member.phone}</p>
            <a href="${member.website}" target="_blank" rel="noopener" class="spotlight-website">Visit Website</a>
        </div>
    `;

    // Add silver class for border styling
    if (!isGold) {
        card.classList.add('silver');
    }

    return card;
}

// Display error state
function displaySpotlightError() {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '<p class="error-message">Unable to load featured members</p>';
}