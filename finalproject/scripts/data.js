/**
 * Data Module - ES Module
 * Handles data fetching and processing using array methods
 */

// ============================================
// LOCAL JSON DATA FETCHING
// ============================================

/**
 * Fetch members data from local JSON file
 * Uses async/await with try...catch
 * @returns {Promise<Array>} Array of member objects
 */
export async function fetchMembers() {
    try {
        const response = await fetch('data/members.json');

        if (!response.ok) {
            throw new Error(`Failed to fetch members: ${response.status}`);
        }

        const data = await response.json();
        return data.members;
    } catch (error) {
        console.error('Error loading members:', error);
        return [];
    }
}

// ============================================
// EVENTS DATA
// ============================================

/**
 * Get upcoming events data
 * @returns {Array} Array of event objects
 */
export function getUpcomingEvents() {
    return [
        {
            id: 1,
            title: "Tech Startup Pitch Night",
            date: "2026-04-15T18:00:00",
            location: "Miracle Tech Hub Main Hall",
            description: "Watch local startups pitch their ideas to investors. Network with fellow entrepreneurs."
        },
        {
            id: 2,
            title: "JavaScript Workshop: Async/Await",
            date: "2026-04-18T10:00:00",
            location: "Training Room B",
            description: "Learn modern JavaScript asynchronous programming patterns with hands-on exercises."
        },
        {
            id: 3,
            title: "Women in Tech Meetup",
            date: "2026-04-22T16:00:00",
            location: "Co-working Space",
            description: "Monthly gathering for women in technology. Share experiences and build connections."
        },
        {
            id: 4,
            title: "Cybersecurity Awareness Summit",
            date: "2026-04-25T09:00:00",
            location: "Conference Center",
            description: "Learn about the latest threats and how to protect your business from cyber attacks."
        }
    ];
}

// ============================================
// MEMBER DATA PROCESSING WITH ARRAY METHODS
// ============================================

let membersCache = null;

/**
 * Get all members with caching
 * @returns {Promise<Array>} All members
 */
export async function getAllMembers() {
    if (!membersCache) {
        membersCache = await fetchMembers();
    }
    return membersCache;
}

/**
 * Get featured members (Gold and Silver tiers only)
 * Uses filter() and sort() array methods
 * @param {number} count - Number of members to return
 * @returns {Promise<Array>} Featured members
 */
export async function getFeaturedMembers(count = 3) {
    const members = await getAllMembers();

    // Filter for gold and silver, then shuffle and slice
    const featured = members
        .filter(member => member.tier === 'gold' || member.tier === 'silver')
        .sort(() => Math.random() - 0.5) // Shuffle
        .slice(0, count);

    return featured;
}

/**
 * Filter members by category
 * Uses filter() array method
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} Filtered members
 */
export async function getMembersByCategory(category) {
    const members = await getAllMembers();

    if (category === 'all') {
        return members;
    }

    return members.filter(member => member.category === category);
}

/**
 * Filter members by tier
 * Uses filter() array method
 * @param {string} tier - Tier to filter by
 * @returns {Promise<Array>} Filtered members
 */
export async function getMembersByTier(tier) {
    const members = await getAllMembers();

    if (tier === 'all') {
        return members;
    }

    return members.filter(member => member.tier === tier);
}

/**
 * Combined filter for category and tier
 * Uses filter() array method with multiple conditions
 * @param {string} category - Category filter
 * @param {string} tier - Tier filter
 * @returns {Promise<Array>} Filtered members
 */
export async function filterMembers(category, tier) {
    const members = await getAllMembers();

    return members.filter(member => {
        const categoryMatch = category === 'all' || member.category === category;
        const tierMatch = tier === 'all' || member.tier === tier;
        return categoryMatch && tierMatch;
    });
}

/**
 * Search members by name
 * Uses filter() and includes() for partial matching
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching members
 */
export async function searchMembers(query) {
    const members = await getAllMembers();
    const lowerQuery = query.toLowerCase();

    return members.filter(member =>
        member.name.toLowerCase().includes(lowerQuery) ||
        member.description.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Get member by ID
 * Uses find() array method
 * @param {number} id - Member ID
 * @returns {Promise<Object|null>} Member object or null
 */
export async function getMemberById(id) {
    const members = await getAllMembers();
    return members.find(member => member.id === id) || null;
}

/**
 * Get category counts for statistics
 * Uses reduce() array method
 * @returns {Promise<Object>} Category counts
 */
export async function getCategoryCounts() {
    const members = await getAllMembers();

    return members.reduce((acc, member) => {
        acc[member.category] = (acc[member.category] || 0) + 1;
        return acc;
    }, {});
}

/**
 * Get tier distribution
 * Uses reduce() array method
 * @returns {Promise<Object>} Tier counts
 */
export async function getTierDistribution() {
    const members = await getAllMembers();

    return members.reduce((acc, member) => {
        acc[member.tier] = (acc[member.tier] || 0) + 1;
        return acc;
    }, {});
}