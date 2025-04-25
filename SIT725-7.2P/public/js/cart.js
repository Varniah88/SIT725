document.addEventListener('DOMContentLoaded', () => {
    // Fetch cart items for the cart page
    async function fetchCart() {
      try {
        const res = await fetch('/cart/guest'); // Adjust the userID as needed
        const result = await res.json();
  
        if (result.success && result.cart && result.cart.items.length > 0) {
          const cartContainer = document.querySelector('#cart-items-list');
          result.cart.items.forEach(item => {
            const cartItemHTML = `
                    <div class="cart-item" id="cart-item-${item.productId}">
                        <span class="item-title">${item.title}</span>
                        <div class="item-details">
                            <span>Quantity: 
                                <input type="number" value="${item.quantity}" min="1" class="update-quantity" data-id="${item.productId}">
                            </span>
                            <button class="btn red remove-from-cart" data-id="${item.productId}">Remove</button>
                        </div>
                    </div>
            `;
            cartContainer.innerHTML += cartItemHTML;
          });
        } else {
          const cartContainer = document.querySelector('#cart-items-list');
          cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    }
  
    fetchCart();
  
    // Listen for change events on quantity inputs
    document.addEventListener('change', async (e) => {
      if (e.target.classList.contains('update-quantity')) {
        const quantity = parseInt(e.target.value, 10);
        const productId = e.target.getAttribute('data-id');
  
        try {
          const res = await fetch('/cart/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity })
          });
  
          const result = await res.json();
          if (result.success) {
            M.toast({ html: 'Cart updated!' });
          } else {
            M.toast({ html: 'Failed to update cart.' });
          }
        } catch (err) {
          console.error('Error updating cart:', err);
        }
      }
    });
  
    // Remove item from cart
    document.addEventListener('click', async (e) => {
      if (e.target.classList.contains('remove-from-cart')) {
        const productId = e.target.getAttribute('data-id');
  
        try {
            const res = await fetch(`/cart/delete/${productId}?userId=guest`, { method: 'DELETE' });
          const result = await res.json();
          if (result.success) {
            document.querySelector(`#cart-item-${productId}`).remove();
            M.toast({ html: 'Item removed from cart!' });
          } else {
            M.toast({ html: 'Failed to remove item from cart.' });
          }
        } catch (err) {
          console.error('Error removing item from cart:', err);
        }
      }
    });
  });

  
  