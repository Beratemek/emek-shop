const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  userId: { type: String, default: 'guest' }, // 'guest' or user ID
  guestInfo: {
    name: String,
    email: String,
    address: String
  },
  products: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: { type: String, default: 'pending' }, // pending, shipped, delivered
  createdAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Order', orderSchema);
