/**
 * DataVerse - Main JavaScript
 * Handles navigation, search, and page initialization
 */

// Chapter data structure
const chapters = [
    {
        id: 1,
        title: "Introduction to Data Analytics",
        description: "Learn the fundamentals of data analytics, its importance, and real-world applications.",
        lessons: ["What is Data Analytics?", "Types of Analytics", "Data Analytics Process", "Career Paths"]
    },
    {
        id: 2,
        title: "Data Collection",
        description: "Master techniques for gathering reliable and relevant data from various sources.",
        lessons: ["Data Sources", "Surveys & Questionnaires", "APIs & Web Scraping", "Sampling Methods"]
    },
    {
        id: 3,
        title: "Data Cleaning",
        description: "Transform raw data into clean, analysis-ready datasets.",
        lessons: ["Handling Missing Values", "Removing Duplicates", "Outlier Detection", "Data Transformation"]
    },
    {
        id: 4,
        title: "Data Visualization",
        description: "Create compelling visual stories with your data using best practices.",
        lessons: ["Visualization Principles", "Chart Types", "Color Theory", "Dashboard Design"]
    },
    {
        id: 5,
        title: "Statistics",
        description: "Understand statistical concepts essential for data analysis.",
        lessons: ["Descriptive Statistics", "Probability", "Hypothesis Testing", "Regression Analysis"]
    },
    {
        id: 6,
        title: "Excel",
        description: "Leverage Excel's powerful features for data analysis.",
        lessons: ["Essential Functions", "Pivot Tables", "Data Validation", "Advanced Formulas"]
    },
    {
        id: 7,
        title: "SQL",
        description: "Query and manipulate databases using SQL.",
        lessons: ["SELECT Statements", "JOINs", "Aggregations", "Subqueries"]
    },
    {
        id: 8,
        title: "Python",
        description: "Use Python for data manipulation and analysis.",
        lessons: ["Python Basics", "Pandas Library", "NumPy Essentials", "Data Visualization with Python"]
    },
    {
        id: 9,
        title: "Power BI",
        description: "Build interactive business intelligence dashboards.",
        lessons: ["Getting Started", "Data Modeling", "DAX Fundamentals", "Report Design"]
    },
    {
        id: 10,
        title: "Machine Learning",
        description: "Introduction to ML concepts for data analysts.",
        lessons: ["ML Overview", "Supervised Learning", "Unsupervised Learning", "Model Evaluation"]
    },
    {
        id: 11,
        title: "Projects",
        description: "Apply your skills to real-world data analytics projects.",
        lessons: ["Project Planning", "Data Exploration", "Analysis & Insights", "Presentation"]
    },
    {
        id: 12,
        title: "Interview Preparation",
        description: "Prepare for data analytics job interviews.",
        lessons: ["Common Questions", "Technical Assessments", "Portfolio Tips", "Salary Negotiation"]
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeAnimations();
    initializeNavigation();
});

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const chapterCards = document.querySelectorAll('.chapter-card');
        
        chapterCards.forEach(card => {
            const title = card.querySelector('.chapter-title').textContent.toLowerCase();
            const description = card.querySelector('.chapter-description').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Initialize GSAP animations
function initializeAnimations() {
    // Hero animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        gsap.from(heroContent.children, {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }

    // Chapter cards animation
    const chapterCards = document.querySelectorAll('.chapter-card');
    if (chapterCards.length > 0) {
        gsap.from(chapterCards, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.chapters-grid',
                start: 'top 80%'
            }
        });
    }
}

// Navigation between lessons
function initializeNavigation() {
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const currentChapter = this.dataset.chapter;
            const currentLesson = this.dataset.lesson;
            // Navigate to previous lesson
            navigateLesson(currentChapter, currentLesson, -1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const currentChapter = this.dataset.chapter;
            const currentLesson = this.dataset.lesson;
            // Navigate to next lesson
            navigateLesson(currentChapter, currentLesson, 1);
        });
    }
}

function navigateLesson(chapterId, lessonIndex, direction) {
    // Implementation for lesson navigation
    console.log('Navigating:', chapterId, lessonIndex, direction);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { chapters, debounce, smoothScrollTo };
}
