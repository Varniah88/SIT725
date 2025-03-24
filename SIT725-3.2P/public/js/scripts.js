// DOMContentLoaded ensures Materialize components are initialized
document.addEventListener('DOMContentLoaded', () => {
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});

// Function to show success modal
function showSuccessModal(event) {
  event.preventDefault(); // Prevent form submission

  // Show the modal
  const successModal = document.querySelector('#successModal');
  const modalInstance = M.Modal.getInstance(successModal);
  modalInstance.open();

  // Optionally send form data via fetch
  const form = event.target;
  const formData = new FormData(form);

  fetch('/submit-form', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        console.log('Form submitted successfully!');
      } else {
        console.error('Error submitting the form.');
      }
    })
    .catch(error => console.error('Error:', error));
}