import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProduct = async () => {
            try {
                if (id) {
                    const { data } = await fetchProduct(id);
                    setProduct(data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getProduct();
    }, [id]);

    if (loading) return <div className="container" style={{marginTop: '100px', textAlign: 'center', color: 'white'}}>Loading...</div>;
    if (!product) return <div className="container" style={{marginTop: '100px', textAlign: 'center', color: 'white'}}>Product not found</div>;

    return (
        <div className="container product-details-page">
            <button onClick={() => navigate(-1)} className="back-btn">
                <ArrowLeft size={20} /> Geri Dön
            </button>

            <div className="product-details-grid glass">
                <div className="detail-image">
                     <img src={product.image || "https://via.placeholder.com/500"} alt={product.name} />
                </div>
                
                <div className="detail-info">
                    <span className="detail-category" style={{color: '#ef4444'}}>%20 İNDİRİM FIRSATI</span>
                    <h1 className="detail-title">{product.name}</h1>
                    <div className="detail-price">
                        <span style={{ textDecoration: 'line-through', fontSize: '1.5rem', color: '#94a3b8', marginRight: '15px' }}>
                            {(product.price * 1.25).toFixed(2)} TL
                        </span>
                        {product.price.toFixed(2)} TL
                    </div>
                    
                    <p className="detail-desc">{product.description || 'Bu ürün için açıklama bulunmuyor.'}</p>
                    
                    <button className="add-to-cart-btn large" onClick={() => addToCart(product)}>
                        <ShoppingCart size={24} />
                        {t('product.addToCart')}
                    </button>

                    <div className="detail-features">
                        <div className="feature-item">
                            <Truck size={20} color="#fbbf24" />
                            <span>Hızlı Teslimat</span>
                        </div>
                        <div className="feature-item">
                            <ShieldCheck size={20} color="#fbbf24" />
                            <span>Güvenli Ödeme</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
