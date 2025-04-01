document.addEventListener('DOMContentLoaded', () => {
  // Fetch cards for the home page
  fetch('/cards')
    .then(response => response.json())
    .then(cards => {
      const productRow = document.querySelector('#products .row');
      cards.forEach(card => {
        const cardHTML = `
          <div class="col s12 m6 l4">
            <div class="card">
              <div class="card-image">
                <img src="${card.image}" alt="${card.title}">
                <span class="card-title">${card.title}</span>
              </div>
              <div class="card-content">
                <p>${card.description}</p>
              </div>
              <div class="card-action">
                <a href="${card.link}">Shop Now</a>
              </div>
            </div>
          </div>
        `;
        productRow.innerHTML += cardHTML;
      });
    })
    .catch(err => console.error('Error fetching cards:', err));

  // Contact form submission via AJAX
  const form = document.querySelector('form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the default form submission

    // Get the form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    // Make the POST request to submit the form
    try {
      const response = await fetch('/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  // Send data as JSON
        },
        body: JSON.stringify(data)  // Convert form data to JSON
      });

      const result = await response.json();
      if (result.success) {  
      // Show the success modal using Materialize
        const successModal = document.getElementById('successModal');
        const modalInstance = M.Modal.init(successModal);
        modalInstance.open();  // Open the modal

      } else {
        console.error('Form submission failed:', result.message);
        alert('There was an issue with your submission.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('There was an issue with your submission.');
    }
  });
});
