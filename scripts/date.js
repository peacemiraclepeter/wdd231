// WDD 231 - Date JavaScript
// Handles dynamic date displays in footer

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in copyright
    const currentYearSpan = document.getElementById('currentyear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Set last modified date
    const lastModifiedParagraph = document.getElementById('lastModified');
    if (lastModifiedParagraph) {
        // Format: MM/DD/YYYY HH:MM:SS
        lastModifiedParagraph.textContent = `Last Modified: ${document.lastModified}`;
    }
});