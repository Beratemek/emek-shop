
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
            'Accept': 'application/json',
            'User-Agent': 'EmekShop/1.0',
            'PG-Auth-Token': authToken
        };

        // 3. Prepare Payload
        // Attempting standard camelCase keys as 200 OK empty body often implies schema mismatch
        // 3. Prepare Payload
        // Reverting to strict Mixed Case as seen in documentation (Step 309)
        const orderId = `ORD-${Date.now()}`;
        
        const payload = {
            "Amount": parseFloat(totalAmount), // Number format as per standard JSON practices unless quoted
            "OrderID": orderId,
            "successCallbackUrl": "https://emek-shop-production.up.railway.app/api/payment/callback?status=success", 
            "failCallbackUrl": "https://emek-shop-production.up.railway.app/api/payment/callback?status=fail",
            "mobilePhoneNumber": user?.phone || "9055555555", // Adjusted Mock Phone
            "InstallmentCount": 1,
            "Currency": "TRY"
        };
        
        // Also prepare PascalCase version in case the docs were literally correct and strict
        // But let's try camelCase first as it's more standard for Tami new API. 
        // NOTE: If this fails, we strongly suspect TerminalID is invalid.

        console.log('[Payment] Generated Hash:', hash);
        console.log('[Payment] Auth Token:', authToken);
        console.log('[Payment] Payload:', JSON.stringify(payload));

        const response = await axios.post(PAYMENT_CONFIG.endpoint, payload, { headers });
        
        console.log('[Payment] Response Status:', response.status);
        console.log('[Payment] Response Data:', JSON.stringify(response.data));

        // 4. Handle Response
        // Check for token in standard property or check if response itself is the token string
        const token = response.data?.oneTimeToken || (typeof response.data === 'string' && response.data.length > 20 ? response.data : null);

        if (token) {
             const redirectUrl = `https://portal.tami.com.tr/hostedPaymentPage?token=${token}`;
             return res.status(200).json({
                 success: true,
                 redirectUrl: redirectUrl
             });
        }

        // If Tami returns 200 but empty/invalid data, it implies successful connection but failed logic (e.g. Hash mismatch silently ignored?)
        throw new Error(`Tami API returned ${response.status} but no token. Check TerminalID or Payload format. Data: ${JSON.stringify(response.data)}`);

    } catch (error) {
        console.error('[Payment] CRITICAL ERROR:', error);
        console.error('[Payment] Stack:', error.stack);
        
        if (error.response) {
            console.error('[Payment] Gateway Response Status:', error.response.status);
            console.error('[Payment] Gateway Response Data:', JSON.stringify(error.response.data, null, 2));
            return res.status(error.response.status).json({ 
                message: 'Ödeme Servisi Hatası (Gateway)', 
                details: error.response.data,
                error: error.message
            });
        }

        // Return stack trace only for debugging (remove in production later)
        res.status(500).json({ 
            message: 'Internal Server Error during Payment', 
            error: error.message,
            stack: error.stack 
        });
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
