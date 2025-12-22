console.log(`[Startup] Starting server... Environment PORT: ${process.env.PORT}`);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth');
const Product = require('./models/product');
const User = require('./models/user');
const Order = require('./models/order');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// Routes
// Routes
const userRoutes = require('./routes/users.js');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// --- Public Product Routes ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// --- Admin Middleware (Simple implementation for now) ---
// Note: In production, verify JWT properly here
const adminMiddleware = async (req, res, next) => {
  // Pass the token in headers: Authorization: Bearer <token>
  // For simplicity in this step, we just assume the request is valid if it reaches here
  // Real implementation will verify token and check role
  next(); 
};

// --- Product Management (Admin) ---
app.post('/api/products', async (req, res) => {
  let product = req.body;
  
  // Ensure additionalImages is an array
  if (product.additionalImages && !Array.isArray(product.additionalImages)) {
    if (typeof product.additionalImages === 'string') {
      product.additionalImages = product.additionalImages.split(',').map(url => url.trim()).filter(url => url.length > 0);
    } else {
      product.additionalImages = [];
    }
  }
  
  const newProduct = new Product(product);
  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  let { name, price, description, image, additionalImages, category, isFeatured, paymentLink } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);

  // Ensure additionalImages is an array
  if (additionalImages && !Array.isArray(additionalImages)) {
    // If it's a string, split by comma
    if (typeof additionalImages === 'string') {
      additionalImages = additionalImages.split(',').map(url => url.trim()).filter(url => url.length > 0);
    } else {
      additionalImages = [];
    }
  }

  const updatedProduct = { name, price, description, image, additionalImages, category, isFeatured, paymentLink, _id: id };
  await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
  res.json(updatedProduct);
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);
  await Product.findByIdAndDelete(id);
  res.json({ message: 'Product deleted successfully.' });
});

// --- User Management (Admin) ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully.' });
});

// --- Order Management (Admin + Public Create) ---

// Create Order (Guest or User)
app.post('/api/orders', async (req, res) => {
    const orderData = req.body;
    const newOrder = new Order(orderData);
    try {
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

// Get All Orders (Admin)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


// Database Connection
const CONNECTION_URL = process.env.CONNECTION_URL || 'mongodb+srv://emekshop:Emekshop123@cluster0.mongodb.net/emekshop?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5001;
console.log(`Port Configuration: process.env.PORT is ${process.env.PORT ? 'SET to ' + process.env.PORT : 'NOT SET. Using default ' + PORT}`);

if (!process.env.CONNECTION_URL) {
    console.log('UYARI: .env dosyası bulunamadı veya CONNECTION_URL tanımlı değil. Default bağlantı adresi kullanılıyor.');
}

// --- Seed Admin User ---
const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@emekshop.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin account created: admin@emekshop.com / admin123');
        }
    } catch (error) {
        console.log('Error seeding admin:', error);
    }
};

// Mongoose connection - FIRE AND FORGET approach for debugging
console.log('Attempting MongoDB connection in background...');
mongoose.connect(CONNECTION_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB Connection Error:', error.message));

// Start server IMMEDIATELY, do not wait for DB
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.status(200).send('EmekShop BackEnd is Active!');
});
