/**
 * Modal Dialog Module
 * Reusable modal functionality using HTMLDialogElement
 */

/**
 * Open modal with member details
 * @param {Object} member - Member data object
 */
export function openModal(member) {
    const modal = document.getElementById('member-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    // Build modal content using template literals
    const content = `
        <div class="modal-header">
            <img src="${member.image}" alt="${member.name}" class="modal-image" onerror="this.src='images/placeholder.jpg'">
            <div class="modal-info">
                <span class="spotlight-tier tier-${member.tier}">${member.tier}</span>
                <h3>${member.name}</h3>
                <p>${formatCategory(member.category)}</p>
            </div>
        </div>
        <div class="modal-body">
            <p><strong>About:</strong> ${member.description}</p>
            <p><strong>Founded:</strong> ${member.founded}</p>
            <p><strong>Employees:</strong> ${member.employees}</p>
            <p><strong>Address:</strong> ${member.address}</p>
        </div>
        <div class="modal-contact">
            <p><strong>📞 Phone:</strong> ${member.phone}</p>
            <p><strong>✉️ Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
            <p><strong>🌐 Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
        </div>
    `;

    modalBody.innerHTML = content;

    // Show modal
    modal.showModal();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Handle close
    const closeBtn = modal.querySelector('.modal-close');

    const closeModal = () => {
        modal.close();
        document.body.style.overflow = '';
    };

    closeBtn.onclick = closeModal;

    // Close on backdrop click
    modal.onclick = (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
            && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            closeModal();
        }
    };

    // Close on Escape key (built into dialog, but ensure cleanup)
    modal.addEventListener('close', () => {
        document.body.style.overflow = '';
    });
}

/**
 * Format category name
 * @param {string} category - Category code
 * @returns {string} Formatted name
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