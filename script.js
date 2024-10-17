// Get references to DOM elements
const eventForm = document.getElementById('eventForm');
const eventList = document.getElementById('eventList');

// Function to fetch events from the server
async function fetchEvents() {
    try {
        const response = await fetch('https://event-management-system-a15q.onrender.com/events');
        const events = await response.json();
        events.forEach(event => addEventToList(event));
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

// Handle event form submission
eventForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get form data
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventDescription = document.getElementById('eventDescription').value;

    // Create event object
    const newEvent = {
        name: eventName,
        date: eventDate,
        description: eventDescription
    };

    // Send the new event to the server
    try {
        const response = await fetch('https://event-management-system-a15q.onrender.com/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        });
        const savedEvent = await response.json();
        addEventToList(savedEvent);
    } catch (error) {
        console.error('Error adding event:', error);
    }

    // Clear form fields
    eventForm.reset();
});

// Function to add event to the DOM
function addEventToList(event) {
    const li = document.createElement('li');
    li.innerHTML = `
        <h3>${event.name}</h3>
        <p>${event.date}</p>
        <p>${event.description}</p>
        <button class="rsvp-button">RSVP</button>
        <button class="delete-button">Delete</button>
        <button class="edit-button">Edit</button>
    `;

    // RSVP button functionality
    const rsvpButton = li.querySelector('.rsvp-button');
    rsvpButton.addEventListener('click', function() {
        alert(`RSVP'd for ${event.name}!`);
    });

    // Delete button functionality
    const deleteButton = li.querySelector('.delete-button');
    deleteButton.addEventListener('click', async function() {
        if (confirm(`Are you sure you want to delete the event "${event.name}"?`)) {
            try {
                // Send DELETE request to the server
                await fetch(`https://event-management-system-a15q.onrender.com/events/${event.id}`, {
                    method: 'DELETE'
                });
                // Remove the event from the DOM
                li.remove();
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    });

    // Edit button functionality
    const editButton = li.querySelector('.edit-button');
    editButton.addEventListener('click', function() {
        // Pre-fill form with event data
        document.getElementById('eventName').value = event.name;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventDescription').value = event.description;

        // Remove the existing event from the DOM
        li.remove();

        // Update the event when the form is submitted
        eventForm.addEventListener('submit', async function updateEvent(e) {
            e.preventDefault();

            const updatedEvent = {
                name: document.getElementById('eventName').value,
                date: document.getElementById('eventDate').value,
                description: document.getElementById('eventDescription').value
            };

            try {
                // Send the updated event to the server
                const response = await fetch(`https://event-management-system-a15q.onrender.com/events/${event.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedEvent)
                });

                const savedEvent = await response.json();
                addEventToList(savedEvent); // Re-add the updated event to the list
            } catch (error) {
                console.error('Error updating event:', error);
            }

            // Clear form and prevent duplicate listeners
            eventForm.reset();
            eventForm.removeEventListener('submit', updateEvent);
        });
    });

    // Append the event to the event list
    eventList.appendChild(li);
}

// Fetch events when the page loads
fetchEvents();
