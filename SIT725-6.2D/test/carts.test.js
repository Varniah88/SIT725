const sinon = require('sinon');
const chai = require('chai');
const request = require('chai-http');
const server = require('../server');
const Cart = require('../models/cart');
const { deleteCartItem } = require('../controllers/cartController');

chai.use(request);
const { expect } = chai;

describe('Cart API (Using Sinon for Complete Mocking)', () => {
  let sandbox; // Use sandbox for isolated stubbing
  const userId = 'guest';
  const productIdShirt = '67fe59f25a12a4491066f868';
  const productIdDress = '67ff51ae57206f1763fe17d2';

  const mockCartData = {
    _id: '67ff4d09111dd80faecc94e8',
    userId: userId,
    items: [
      {
        _id: '67ff4d593d1cdb44b3d416d6',
        productId: productIdShirt,
        title: 'EcoStitch Shirt',
        quantity: 1,
      },
      {
        _id: '67ff51ae57206f1763fe17d2',
        productId: productIdDress,
        title: 'Summer Dress',
        quantity: 1,
      },
    ],
    __v: 11,
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock Cart.findOne globally
    sandbox.stub(Cart, 'findOne').callsFake(() => {
      return Promise.resolve({
        ...mockCartData,
        save: sandbox.stub().resolves({
          ...mockCartData,
          items: mockCartData.items.filter(item => item._id !== productIdDress), // Simulate deletion
        }),
      });
    });

    // Mock save method for Cart
    sandbox.stub(Cart.prototype, 'save').callsFake(function () {
      const existingItem = this.items.find(item => item.productId === productIdShirt);
      if (existingItem) {
        existingItem.quantity += 2; // Simulate quantity increase
      } else {
        this.items.push({
          _id: 'new_item_id',
          productId: productIdShirt,
          title: 'EcoStitch Shirt',
          quantity: 2,
        });
      }
      return Promise.resolve(this);
    });

    // Mock Cart.find method
    sandbox.stub(Cart, 'find').resolves([mockCartData]);
  });

  afterEach(() => {
    sandbox.restore(); // Clean up stubs after each test
  });

  it('should POST a new cart item', async () => {
    const newItem = {
      productId: productIdShirt,
      title: 'EcoStitch Shirt',
      quantity: 2,
    };

    const res = await chai.request(server).post('/cart/add').send(newItem);

    expect(res.status).to.equal(200);
    expect(res.body.cart).to.exist;
    const updatedItem = res.body.cart.items.find(item => item.productId === productIdShirt);
    expect(updatedItem).to.exist;
    expect(updatedItem.quantity).to.equal(3);
  });

  it('should GET all cart items', async () => {
    const res = await chai.request(server).get(`/cart/${userId}`);

    expect(res.status).to.equal(200);
    expect(res.body.cart).to.exist;
    expect(res.body.cart.items.length).to.equal(2);
    expect(res.body.cart.items[0].title).to.equal('EcoStitch Shirt');
  });

  it('should PUT (update) a cart item', async () => {
    const updatedItem = {
      productId: productIdShirt,
      quantity: 3,
    };

    const res = await chai.request(server).put('/cart/update').send(updatedItem);

    expect(res.status).to.equal(200);
    expect(res.body.cart).to.exist;
    expect(res.body.cart.items[0].quantity).to.equal(3);
  });

  it('should DELETE a cart item successfully', async () => {
    // Send DELETE request with proper query parameters
    const res = await chai.request(server).delete(`/cart/delete/${productIdDress}?userId=guest`);

    // Assert successful response
    expect(res.status).to.equal(200);
    expect(res.body.cart).to.exist;
    expect(res.body.cart.items.length).to.equal(1); // Validate remaining items in the cart
    expect(res.body.cart.items[0]._id).to.equal('67ff4d593d1cdb44b3d416d6'); // Check the remaining item's ID
  });
});