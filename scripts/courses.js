// WDD 231 - Courses JavaScript
// Handles dynamic course display and filtering

// Course data array
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Web Frontend Development I',
        credits: 2,
        completed: false
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const coursesContainer = document.getElementById('courses-container');
    const totalCreditsSpan = document.getElementById('total-credits');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Display all courses initially
    displayCourses(courses);

    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            filterCourses(filter);
        });
    });

    // Function to filter courses
    function filterCourses(filter) {
        let filteredCourses;

        if (filter === 'all') {
            filteredCourses = courses;
        } else {
            filteredCourses = courses.filter(course =>
                course.subject.toLowerCase() === filter.toLowerCase()
            );
        }

        displayCourses(filteredCourses);
    }

    // Function to display courses
    function displayCourses(coursesToDisplay) {
        // Clear container
        coursesContainer.innerHTML = '';

        // Create and append course cards
        coursesToDisplay.forEach(course => {
            const courseCard = createCourseCard(course);
            coursesContainer.appendChild(courseCard);
        });

        // Update total credits
        updateTotalCredits(coursesToDisplay);
    }

    // Function to create course card element
    function createCourseCard(course) {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : ''}`;

        card.innerHTML = `
            <div class="course-code">${course.subject} ${course.number}</div>
            <div class="course-title">${course.title}</div>
            <div class="course-credits">${course.credits} Credits</div>
        `;

        return card;
    }

    // Function to calculate and display total credits
    function updateTotalCredits(coursesToCalculate) {
        const total = coursesToCalculate.reduce((sum, course) => sum + course.credits, 0);
        totalCreditsSpan.textContent = total;
    }
});