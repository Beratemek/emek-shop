const express = require('express');
const axios = require('axios');
const router = express.Router();

// --- CONFIGURATION ---
const USE_SIMULATION = false; // Set to false to enable Real Payments

// Tami / Garanti BBVA Virtual POS Credentials
// Note: In production, move these to environment variables
const PAYMENT_CONFIG = {
    merchantId: '77018370',
    secretKey: 'a811da2b-5855-4302-aac1-c71b7cfd0c23',
    kValue: 'KxiO5xEuF_9PIgEefMz0VJOWiu8vlX5kjNIjI3L9VUuIsj7kIA1oohS3RzwjnxQWTRmkK8ik7488ZMug3NQIgg=',
    kidValue: '760bd3cc-0721-414d-aaf3-8ef9e50691b7',
    // Endpoint discovered from docs: https://paymentapi.tami.com.tr
    endpoint: process.env.TAMI_API_URL || 'https://paymentapi.tami.com.tr/v1/payment/checkout' 
};

// Create Payment Session / Mock Checkout
router.post('/checkout', async (req, res) => {
    const { cart, user, totalAmount } = req.body;

    console.log(`[Payment] Initiating Checkout (${USE_SIMULATION ? 'SIMULATION' : 'LIVE'}) for:`, {
        merchantId: PAYMENT_CONFIG.merchantId,
        amount: totalAmount,
        userEmail: user?.email
    });

    try {
        const payload = {
            price: totalAmount,
            paidPrice: totalAmount,
            currency: 'TRY',
            basketId: `ORD-${Date.now()}`,
            paymentGroup: 'PRODUCT',
            callbackUrl: 'http://localhost:5173/payment/callback',
            buyer: {
                id: user?.id || 'GUEST',
                name: user?.name || 'Guest User',
                surname: 'User',
                email: user?.email || 'guest@example.com',
                identityNumber: '11111111111',
                registrationAddress: 'Test Address',
                city: 'Istanbul',
                country: 'Turkey'
            },
            billingAddress: {
                contactName: user?.name || 'Guest User',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Test Address'
            },
            basketItems: cart.map(item => ({
                id: item._id,
                name: item.name,
                category1: item.category || 'General',
                itemType: 'PHYSICAL',
                price: item.price
            }))
        };

        // --- SIMULATION MODE ---
        if (USE_SIMULATION) {
            console.log('[Payment] Simulating successful payment gateway response...');
            setTimeout(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'Payment session created (Simulation)',
                    redirectUrl: '/payment/success', 
                    paymentId: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                });
            }, 1000);
            return;
        }

        // --- LIVE MODE ---
        const headers = {
            'Content-Type': 'application/json',
            'X-Merchant-Id': PAYMENT_CONFIG.merchantId,
            'Authorization': `Bearer ${PAYMENT_CONFIG.secretKey}`, 
            'X-K-Value': PAYMENT_CONFIG.kValue,
            'X-Kid-Value': PAYMENT_CONFIG.kidValue
        };

        console.log('[Payment] Sending request to Tami API:', PAYMENT_CONFIG.endpoint);
        const response = await axios.post(PAYMENT_CONFIG.endpoint, payload, { headers });
        console.log('[Payment] Success Response:', response.data);
        return res.status(200).json(response.data);

    } catch (error) {
        console.error('[Payment] Error:', error.message);
        if (error.response) {
            console.error('[Payment] Gateway Response:', error.response.data);
            return res.status(error.response.status).json({ 
                message: 'Ödeme Servisi Hatası', 
                details: error.response.data,
                error: error.message 
            });
        }
        res.status(500).json({ message: 'Payment initiation failed', error: error.message });
    }
});

// Callback route for 3D Secure or Payment Gateway notifications
router.post('/callback', (req, res) => {
    console.log('[Payment] Callback received:', req.body);
    // Determine status from body (varies by provider)
    // For Tami/Garanti, usually 'success' or 'status' fields
    
    // Redirect user to frontend success/fail page
    res.redirect('http://localhost:5173/payment/success?status=success'); 
});

module.exports = router;
