// WDD 231 Week 04 - Thank You Page - Display Form Data from URL Parameters

document.addEventListener('DOMContentLoaded', () => {
    displayFormData();
});

function displayFormData() {
    const formDataContainer = document.getElementById('form-data');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Required fields to display
    const fields = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email Address' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'organization', label: 'Business/Organization' },
        { key: 'timestamp', label: 'Application Date' }
    ];

    // Check if we have any data
    const hasData = fields.some(field => urlParams.has(field.key));

    if (!hasData) {
        formDataContainer.innerHTML = '<p class="error-message">No application data found. Please submit the form again.</p>';
        return;
    }

    // Build HTML for form data
    let html = '';

    fields.forEach(field => {
        const value = urlParams.get(field.key);
        if (value) {
            // Format timestamp for display
            let displayValue = decodeURIComponent(value);
            if (field.key === 'timestamp') {
                displayValue = formatTimestamp(displayValue);
            }

            html += `
                <div class="data-row ${field.key === 'organization' ? 'full-width' : ''}">
                    <span class="data-label">${field.label}:</span>
                    <span class="data-value">${displayValue}</span>
                </div>
            `;
        }
    });

    formDataContainer.innerHTML = html;
}

// Format timestamp to readable date
function formatTimestamp(timestamp) {
    try {
        // Handle format: YYYY-MM-DD HH:MM:SS
        const parts = timestamp.split(' ');
        if (parts.length === 2) {
            const dateParts = parts[0].split('-');
            const timeParts = parts[1].split(':');

            const date = new Date(
                parseInt(dateParts[0]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[2]),
                parseInt(timeParts[0]),
                parseInt(timeParts[1])
            );

            return date.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return timestamp;
    } catch (e) {
        return timestamp;
    }
}