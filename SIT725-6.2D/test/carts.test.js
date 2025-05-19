const sinon = require('sinon');
const chai = require('chai');
const request = require('chai-http');
const server = require('../server');
const Cart = require('../models/cart');

chai.use(request);
const { expect } = chai;

describe('Cart API', () => {
  let sandbox;
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

    sandbox.stub(Cart, 'findOne').callsFake(() => {
      return Promise.resolve({
        ...mockCartData,
        save: sandbox.stub().resolves({
          ...mockCartData,
          items: mockCartData.items.filter(item => item._id !== productIdDress),
        }),
      });
    });

    sandbox.stub(Cart.prototype, 'save').callsFake(function () {
      const existingItem = this.items.find(item => item.productId === productIdShirt);
      if (existingItem) {
        existingItem.quantity += 2;
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

    sandbox.stub(Cart, 'find').resolves([mockCartData]);
  });

  afterEach(() => {
    sandbox.restore();
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
    const res = await chai.request(server).delete(`/cart/delete/${productIdDress}?userId=guest`);

    expect(res.status).to.equal(200);
    expect(res.body.cart).to.exist;
    expect(res.body.cart.items.length).to.equal(1);
    expect(res.body.cart.items[0]._id).to.equal('67ff4d593d1cdb44b3d416d6');
  });

  it('should return 400 if productId is missing when adding to cart', async () => {
    const res = await chai.request(server).post('/cart/add').send({ title: 'No ProductId' });
    expect(res).to.have.status(400);
    expect(res.body.message).to.match(/missing required fields/i);
  });

  it('should return 400 if title is missing when adding to cart', async () => {
    const res = await chai.request(server).post('/cart/add').send({ productId: productIdShirt });
    expect(res).to.have.status(400);
    expect(res.body.message).to.match(/missing required fields/i);
  });

  it('should return 400 when updating cart item quantity to zero or negative', async () => {
    const res = await chai.request(server).put('/cart/update').send({
      productId: productIdShirt,
      quantity: 0,
    });
    expect(res).to.have.status(400);
    expect(res.body.message).to.match(/required/i);
  });

  it('should return 400 when updating cart without productId', async () => {
    const res = await chai.request(server).put('/cart/update').send({ quantity: 5 });
    expect(res).to.have.status(400);
    expect(res.body.message).to.match(/productId and quantity are required/i);
  });

  it('should return 404 when deleting cart item without productId', async () => {
    const res = await chai.request(server).delete('/cart/delete/').query({ userId: userId });
    expect(res).to.have.status(404);
  });

  it('should return 404 when deleting non-existent cart item', async () => {
    Cart.findOne.restore();
    sandbox.stub(Cart, 'findOne').resolves({
      ...mockCartData,
      items: mockCartData.items.filter(item => item.productId !== 'nonexistentProduct'),
      save: sandbox.stub().resolves(),
    });

    const res = await chai.request(server)
      .delete('/cart/delete/nonexistentProduct')
      .query({ userId: userId });

    expect(res).to.have.status(404);
    expect(res.body.message).to.match(/item not found/i);
  });

it('should return 404 when accessing cart without a userId param', async () => {
  const res = await chai.request(server)
    .get('/api/cart')
    .set('Accept', 'application/json');
  expect(res).to.have.status(404);
});

});
