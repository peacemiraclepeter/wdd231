// WDD 231 Week 04 - Join Page Functionality

document.addEventListener('DOMContentLoaded', () => {
    // Set timestamp when form loads
    setTimestamp();

    // Setup modal functionality
    setupModals();
});

// Set hidden timestamp field with current date and time
function setTimestamp() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        // Format: YYYY-MM-DD HH:MM:SS
        const formatted = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');
        timestampField.value = formatted;
    }
}

// Setup modal open/close functionality
function setupModals() {
    const infoButtons = document.querySelectorAll('.info-btn');
    const closeButtons = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.membership-modal');

    // Open modal when info button is clicked
    infoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
                // Trap focus within modal for accessibility
                trapFocus(modal);
            }
        });
    });

    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('dialog');
            if (modal) {
                modal.close();
            }
        });
    });

    // Close modal when clicking on backdrop
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            const rect = modal.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                modal.close();
            }
        });

        // Close on Escape key (built into dialog, but ensure cleanup)
        modal.addEventListener('close', () => {
            // Return focus to the button that opened the modal
            const opener = document.querySelector(`[data-modal="${modal.id}"]`);
            if (opener) {
                opener.focus();
            }
        });
    });
}

// Accessibility: Trap focus within modal
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}