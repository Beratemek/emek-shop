import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, ArrowLeft, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { checkout } from '../api';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            // Get user from local storage if available
            const user = JSON.parse(localStorage.getItem('profile') || '{}')?.result;
            
            const response = await checkout({
                cart,
                totalAmount: total,
                user
            });

            if (response.data?.redirectUrl) {
                // If 3D secure or external page
                // window.location.href = response.data.redirectUrl; 
                // For simulation/SPA flow:
                 clearCart();
                 // In a real scenario, we might go to an external URL. 
                 // For this v1 integration with simulation:
                 alert('Ödeme Başarılı! (Simülasyon)');
                 navigate('/');
            } else {
                 clearCart();
                 alert('Ödeme işleminiz başarıyla alındı. (Test/Simülasyon)');
                 navigate('/');
            }
        } catch (error) {
            console.error(error);
            alert('Ödeme başlatılamadı. Lütfen tekrar deneyiniz.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ marginTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
                <div className="glass" style={{ padding: '40px', display: 'inline-block', borderRadius: '15px' }}>
                    <h2>{t('cart.empty')}</h2>
                    <Link to="/products" className="cta-button" style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <ArrowLeft size={20} />
                        {t('cart.continue')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '100px', padding: '20px' }}>
            <h1 className="section-title">{t('cart.title')}</h1>
            
            <div className="cart-layout">
                <div className="cart-items glass">
                    {cart.map((item) => (
                        <div key={item._id} className="cart-item">
                            <div className="item-image">
                                <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} />
                            </div>
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p className="item-price">{item.price.toFixed(2)} TL</p>
                            </div>
                            <div className="item-quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="qty-btn" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="qty-btn" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>+</button>
                            </div>
                            <div className="item-total">
                                {(item.price * item.quantity).toFixed(2)} TL
                            </div>
                            <button onClick={() => removeFromCart(item._id)} className="remove-btn" title={t('cart.remove')}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary glass">
                    <h3>{t('cart.total')}</h3>
                    <div className="total-amount">
                        {total.toFixed(2)} TL
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout} disabled={isProcessing}>
                        {isProcessing ? 'İşleniyor...' : t('cart.checkout')} 
                        {!isProcessing && <ArrowRight size={20} />}
                    </button>
                    
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <Truck size={18} color="#fbbf24" />
                             <span>Hızlı Teslimat</span>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <ShieldCheck size={18} color="#fbbf24" />
                             <span>%100 Güvenli Ödeme</span>
                         </div>
                    </div>
                    <Link to="/products" className="continue-link">
                        {t('cart.continue')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
