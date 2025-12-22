
const express = require('express');
const axios = require('axios');
const router = express.Router();
const crypto = require('crypto');

// --- CONFIGURATION ---
const USE_SIMULATION = false; // Set to false to enable Real Payments

// Tami / Garanti BBVA Credentials
// Note: In production, move these to environment variables
const PAYMENT_CONFIG = {
    merchantId: '77018370',
    // Terminal ID is explicitly required for hash, but if unknown, some integrations use MerchantID or a specific value.
    // Try using MerchantID as fallback if specific TerminalID is not provided.
    terminalId: '77018370', 
    secretKey: 'a811da2b-5855-4302-aac1-c71b7cfd0c23',
    endpoint: 'https://paymentapi.tami.com.tr/hosted/create-one-time-hosted-token'
};

// Helper: Generate SHA256 Hash -> Base64
const generateHash = (merchantId, terminalId, secretKey) => {
    try {
        const rawString = merchantId + terminalId + secretKey;
        const hash = crypto.createHash('sha256').update(rawString).digest('base64');
        return hash;
    } catch (error) {
        console.error('Hash generation failed:', error);
        return null;
    }
};

// Create Payment Session (Hosted Page)
router.post('/checkout', async (req, res) => {
    const { cart, user, totalAmount } = req.body;

    console.log(`[Payment] Initiating Hosted Checkout (${USE_SIMULATION ? 'SIMULATION' : 'LIVE'})...`);

    try {
        // --- SIMULATION MODE ---
        if (USE_SIMULATION) {
            return setTimeout(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'Simulation Redirect',
                    redirectUrl: '/payment/success' 
                });
            }, 1000);
        }

        // --- LIVE MODE: Hosted Payment Page ---
        // 1. Calculate Hash
        const hash = generateHash(PAYMENT_CONFIG.merchantId, PAYMENT_CONFIG.terminalId, PAYMENT_CONFIG.secretKey);
        
        // 2. Prepare Headers
        // Header Format: MerchantNumber:TerminalNumber:Hash 
        // (Removing 'ISYERINO' prefix unless specified by specific docs, usually it's just value)
        const authToken = `${PAYMENT_CONFIG.merchantId}:${PAYMENT_CONFIG.terminalId}:${hash}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'PG-Auth-Token': authToken
        };

        // 3. Prepare Payload
        const orderId = `ORD-${Date.now()}`;
        const payload = {
            "Amount": parseFloat(totalAmount).toFixed(2),
            "OrderID": orderId,
            "successCallbackUrl": "https://emek-shop-production.up.railway.app/api/payment/callback?status=success", // Production URL
            "failCallbackUrl": "https://emek-shop-production.up.railway.app/api/payment/callback?status=fail",
            // Mobile Phone is often mandatory for 3D/Hosted
            "mobilePhoneNumber": user?.phone || "905555555555", 
            "InstallmentCount": 1,
            "Currency": "TRY"
        };

        console.log('[Payment] Sending request to Tami Hosted API:', PAYMENT_CONFIG.endpoint);
        console.log('[Payment] Request Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(PAYMENT_CONFIG.endpoint, payload, { headers });
        
        console.log('[Payment] Success Response:', response.data);

        // 4. Handle Response
        // API returns a 'oneTimeToken'. We must redirect user to the portal with this token.
        if (response.data && response.data.success && response.data.oneTimeToken) {
             const redirectUrl = `https://portal.tami.com.tr/hostedPaymentPage?token=${response.data.oneTimeToken}`;
             return res.status(200).json({
                 success: true,
                 redirectUrl: redirectUrl
             });
        }

        // If API returns success=false or no token
        throw new Error(response.data?.errorMessage || 'Token creation failed');

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
