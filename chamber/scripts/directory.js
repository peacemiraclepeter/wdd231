// Chamber Directory - Fetch and Display Members with Async/Await
const membersURL = 'data/members.json';

document.addEventListener('DOMContentLoaded', () => {
    fetchMembers();
    setupViewToggle();
});

// Async function to fetch members data
async function fetchMembers() {
    try {
        const response = await fetch(membersURL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error('Error fetching members:', error);
        document.getElementById('members-container').innerHTML =
            '<p class="error">Unable to load member data. Please try again later.</p>';
    }
}

// Display members in the container
function displayMembers(members) {
    const container = document.getElementById('members-container');
    container.innerHTML = '';

    members.forEach(member => {
        const card = createMemberCard(member);
        container.appendChild(card);
    });
}

// Create member card element
function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';

    // Determine membership level class and text
    let levelClass, levelText;
    switch (member.membershipLevel) {
        case 3:
            levelClass = 'level-gold';
            levelText = 'Gold Member';
            break;
        case 2:
            levelClass = 'level-silver';
            levelText = 'Silver Member';
            break;
        default:
            levelClass = 'level-member';
            levelText = 'Member';
    }

    card.innerHTML = `
        <img src="images/technology1.jpg"
             alt="${member.name} logo" 
             class="member-image"
             loading="lazy"
             onerror="this.src='images/placeholder.jpg'">
        <div class="member-content">
            <h3 class="member-name">${member.name}</h3>
            <span class="member-level ${levelClass}">${levelText}</span>
            <p class="member-description">${member.description}</p>
            <p class="member-contact">📍 ${member.address}</p>
            <p class="member-contact">📞 ${member.phone}</p>
            <a href="${member.website}" target="_blank" class="member-website">Visit Website</a>
        </div>
    `;

    return card;
}

// Setup view toggle buttons
function setupViewToggle() {
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    const container = document.getElementById('members-container');

    gridBtn.addEventListener('click', () => {
        container.classList.remove('list');
        container.classList.add('grid');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });

    listBtn.addEventListener('click', () => {
        container.classList.remove('grid');
        container.classList.add('list');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });
}