/* 
 * AI Travel Itinerary Maker
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize functionality based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Common functionality for all pages
    initializeNavigation();
    
    // Page-specific functionality
    if (currentPage === 'index.html' || currentPage === '') {
        initializeHomePage();
    } else if (currentPage === 'preferences-step1.html') {
        initializeStep1Form();
    } else if (currentPage === 'preferences-step2.html') {
        initializeStep2Form();
    } else if (currentPage === 'preferences-step3.html') {
        initializeStep3Form();
    } else if (currentPage === 'preferences-step4.html') {
        initializeStep4Form();
    } else if (currentPage === 'itinerary-results.html') {
        initializeItineraryResults();
    } else if (currentPage === 'customize-itinerary.html') {
        initializeCustomizeItinerary();
    }
});

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active link highlighting
    const currentLocation = window.location.pathname;
    document.querySelectorAll('.navbar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentLocation || 
            (currentLocation.endsWith('/') && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Home page functionality
function initializeHomePage() {
    // Destination card hover effects are handled by CSS
    
    // Initialize any sliders or carousels if needed
    // This would be implemented if we had added a carousel component
}

// Step 1 Form functionality
function initializeStep1Form() {
    const form = document.getElementById('step1Form');
    if (!form) return;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').min = today;
    document.getElementById('endDate').min = today;
    
    // Ensure end date is after start date
    document.getElementById('startDate').addEventListener('change', function() {
        document.getElementById('endDate').min = this.value;
        
        // If end date is before start date, update it
        const endDate = document.getElementById('endDate');
        if (endDate.value && endDate.value < this.value) {
            endDate.value = this.value;
        }
    });
    
    // Form submission - store data in localStorage
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            destination: document.getElementById('destination').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            travelers: document.getElementById('travelers').value
        };
        
        // Store in localStorage
        localStorage.setItem('travelPreferences', JSON.stringify(formData));
        
        // Navigate to next step
        window.location.href = 'preferences-step2.html';
    });
}

// Step 2 Form functionality
function initializeStep2Form() {
    const form = document.getElementById('step2Form');
    if (!form) return;
    
    // Budget range slider
    const budgetRange = document.getElementById('budgetRange');
    const budgetValue = document.getElementById('budgetValue');
    
    budgetRange.addEventListener('input', function() {
        budgetValue.textContent = '$' + parseInt(this.value).toLocaleString();
    });
    
    // Ensure at least one option is selected for each category
    function validateCheckboxGroup(checkboxName) {
        const checkboxes = document.querySelectorAll(`input[id^="${checkboxName}"]`);
        let checked = false;
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checked = true;
            }
        });
        
        return checked;
    }
    
    // Form submission - store data in localStorage
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate at least one option is selected for each category
        if (!validateCheckboxGroup('accom')) {
            alert('Please select at least one accommodation type.');
            return;
        }
        
        if (!validateCheckboxGroup('act')) {
            alert('Please select at least one activity type.');
            return;
        }
        
        if (!validateCheckboxGroup('trans')) {
            alert('Please select at least one transportation method.');
            return;
        }
        
        // Get form data
        const formData = {
            budget: document.getElementById('budgetRange').value,
            accommodation: getSelectedCheckboxValues('accom'),
            activities: getSelectedCheckboxValues('act'),
            transportation: getSelectedCheckboxValues('trans')
        };
        
        // Store in localStorage
        localStorage.setItem('travelPreferencesStep2', JSON.stringify(formData));
        
        // Navigate to next step
        window.location.href = 'preferences-step3.html';
    });
    
    // Helper function to get all selected checkbox values
    function getSelectedCheckboxValues(prefix) {
        const checkboxes = document.querySelectorAll(`input[id^="${prefix}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }
}

// Step 3 Form functionality
function initializeStep3Form() {
    const form = document.getElementById('step3Form');
    if (!form) return;
    
    // Handle "None" checkbox for dietary restrictions
    document.getElementById('dietNone').addEventListener('change', function() {
        if (this.checked) {
            // Uncheck all other dietary options
            document.querySelectorAll('input[id^="diet"]:not(#dietNone)').forEach(cb => {
                cb.checked = false;
            });
        }
    });
    
    // Uncheck "None" when any other option is selected
    document.querySelectorAll('input[id^="diet"]:not(#dietNone)').forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('dietNone').checked = false;
            }
        });
    });
    
    // Handle "None" checkbox for accessibility requirements
    document.getElementById('accessNone').addEventListener('change', function() {
        if (this.checked) {
            // Uncheck all other accessibility options
            document.querySelectorAll('input[id^="access"]:not(#accessNone)').forEach(cb => {
                cb.checked = false;
            });
        }
    });
    
    // Uncheck "None" when any other option is selected
    document.querySelectorAll('input[id^="access"]:not(#accessNone)').forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('accessNone').checked = false;
            }
        });
    });
    
    // Form submission - store data in localStorage
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            dietaryRestrictions: getSelectedCheckboxValues('diet'),
            accessibilityRequirements: getSelectedCheckboxValues('access'),
            additionalInfo: document.getElementById('additionalInfo').value
        };
        
        // Store in localStorage
        localStorage.setItem('travelPreferencesStep3', JSON.stringify(formData));
        
        // Navigate to next step
        window.location.href = 'preferences-step4.html';
    });
    
    // Helper function to get all selected checkbox values
    function getSelectedCheckboxValues(prefix) {
        const checkboxes = document.querySelectorAll(`input[id^="${prefix}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }
}

// Step 4 Form functionality
function initializeStep4Form() {
    const form = document.getElementById('step4Form');
    if (!form) return;
    
    // Load data from previous steps
    loadReviewData();
    
    // Form submission - generate itinerary
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get optimization preference
        const optimizationPreference = document.querySelector('input[name="aiOptimize"]:checked').value;
        
        // Store in localStorage
        localStorage.setItem('optimizationPreference', optimizationPreference);
        
        // Navigate to results page
        window.location.href = 'itinerary-results.html';
    });
    
    // Load and display data from previous steps
    function loadReviewData() {
        try {
            // Step 1 data
            const step1Data = JSON.parse(localStorage.getItem('travelPreferences'));
            if (step1Data) {
                document.getElementById('reviewDestination').textContent = step1Data.destination;
                
                // Format dates
                const startDate = new Date(step1Data.startDate);
                const endDate = new Date(step1Data.endDate);
                const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                document.getElementById('reviewDates').textContent = 
                    `${startDate.toLocaleDateString('en-US', dateOptions)} to ${endDate.toLocaleDateString('en-US', dateOptions)}`;
                
                document.getElementById('reviewTravelers').textContent = step1Data.travelers;
            }
            
            // Step 2 data
            const step2Data = JSON.parse(localStorage.getItem('travelPreferencesStep2'));
            if (step2Data) {
                document.getElementById('reviewBudget').textContent = '$' + parseInt(step2Data.budget).toLocaleString();
                document.getElementById('reviewAccommodation').textContent = step2Data.accommodation.join(', ');
                document.getElementById('reviewActivities').textContent = step2Data.activities.join(', ');
                document.getElementById('reviewTransportation').textContent = step2Data.transportation.join(', ');
            }
            
            // Step 3 data
            const step3Data = JSON.parse(localStorage.getItem('travelPreferencesStep3'));
            if (step3Data) {
                document.getElementById('reviewDietary').textContent = 
                    step3Data.dietaryRestrictions.length > 0 ? step3Data.dietaryRestrictions.join(', ') : 'None';
                
                document.getElementById('reviewAccessibility').textContent = 
                    step3Data.accessibilityRequirements.length > 0 ? step3Data.accessibilityRequirements.join(', ') : 'None';
                
                document.getElementById('reviewNotes').textContent = 
                    step3Data.additionalInfo ? step3Data.additionalInfo : 'No additional notes provided.';
            }
        } catch (error) {
            console.error('Error loading review data:', error);
        }
    }
}

// Itinerary Results functionality
function initializeItineraryResults() {
    // Initialize day tabs
    const dayTabs = document.querySelectorAll('.day-tab');
    if (dayTabs.length > 0) {
        dayTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                dayTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding day content (would be implemented with actual content)
                const day = this.getAttribute('data-day');
                // This would load or show the content for the selected day
                console.log(`Showing content for day ${day}`);
                
                // For demo purposes, we're only showing day 1 content
                // In a real implementation, we would show/hide different day contents
            });
        });
    }
    
    // Initialize print functionality
    const printButton = document.getElementById('printItinerary');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Initialize save functionality
    const saveButton = document.getElementById('saveItinerary');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            alert('Itinerary saved successfully!');
            // In a real implementation, this would save to a database or user account
        });
    }
    
    // Initialize map (placeholder for actual map implementation)
    initializePlaceholderMap();
}

// Customize Itinerary functionality
function initializeCustomizeItinerary() {
    // This would be implemented if we had created the customize-itinerary.html page
    console.log('Customize itinerary page initialized');
}

// Helper function to initialize a placeholder map
function initializePlaceholderMap() {
    const mapElement = document.getElementById('itineraryMap');
    if (!mapElement) return;
    
    // In a real implementation, this would initialize a map using a library like Google Maps or Leaflet
    // For now, we're just showing a placeholder
    console.log('Map placeholder initialized');
}
