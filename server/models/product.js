const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  additionalImages: [String],
  category: String,
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Product', productSchema);
