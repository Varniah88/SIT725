document.addEventListener('DOMContentLoaded', () => {
  // Fetch cards for the home page
  fetch('/cards')
    .then(response => response.json())
    .then(cards => {
      const productRow = document.querySelector('#products .row');
      cards.forEach(card => {
        const cardHTML = `
          <div class="col s12 m6 l4">
            <div class="card" data-id="${card._id}">
              <div class="card-image">
                <img src="${card.image}" alt="${card.title}">
                <span class="card-title">${card.title}</span>
              </div>
              <div class="card-content">
                <p>${card.description}</p>
              </div>
              <div class="card-action">
                <a href="${card.link}">Shop Now</a>
                <button class="btn green add-to-cart">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
        productRow.innerHTML += cardHTML;
      });
    })
    .catch(err => console.error('Error fetching cards:', err));

  // Add to cart functionality
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const card = e.target.closest('.card');
      const title = card.querySelector('.card-title').textContent;
      const productId = card.getAttribute('data-id');

      const payload = {
        userId: 'guest',
        productId,
        title,
        quantity: 1
      };

      try {
        const res = await fetch('/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
          M.toast({ html: 'Item added to cart!' });
          updateCartCount(); // Update count after adding
        } else {
          M.toast({ html: 'Failed to add to cart' });
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  // Contact form submission with success modal
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };

      try {
        const response = await fetch('/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
          const successModal = document.getElementById('successModal');
          const modalInstance = M.Modal.init(successModal);
          modalInstance.open();
          form.reset(); // Clear form fields after submission
        } else {
          alert('There was an issue with your submission.');
        }
      } catch (error) {
        console.error('Error during form submission:', error);
        alert('There was an issue with your submission.');
      }
    });
  }

  updateCartCount(); // Initial cart count on page load
});

async function updateCartCount() {
  try {
    const res = await fetch('/cart/guest'); // Use real userId if applicable
    const result = await res.json();

    if (result.success && result.cart) {
      const count = result.cart.items.reduce((total, item) => total + item.quantity, 0);
      document.getElementById('cart-count').textContent = count;
    }
  } catch (err) {
    console.error('Error fetching cart count:', err);
  }
}
