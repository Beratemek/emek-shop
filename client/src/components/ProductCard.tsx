import { CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
// import { useCart } from '../context/CartContext'; // Cart disabled for now
import './ProductCard.css';

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  paymentLink?: string;
}

import { Link } from 'react-router-dom';

const ProductCard = ({ product }: { product: ProductProps }) => {
  const { t } = useLanguage();
  // const { addToCart } = useCart(); 

  const handlePayment = () => {
      if (product.paymentLink) {
          window.location.href = product.paymentLink;
      } else {
          alert('Bu ürün için ödeme linki henüz eklenmedi. Lütfen daha sonra tekrar deneyiniz.');
      }
  };

  return (
    <div className="product-card glass">
      <div className="product-image-container">
        <Link to={`/product/${product._id}`} className="img-placeholder">
           <span className="premium-badge" style={{background: '#ef4444', color: 'white'}}>%20 İndirim</span>
           <img src={product.image || "https://via.placeholder.com/300x200/101525/fbbf24?text=EmekShop+Item"} alt={product.name} />
        </Link>
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-subtitle">{t('product.handpicked')}</p>
        <div className="product-footer">
          <div className="price-tag">
            <span style={{ textDecoration: 'line-through', fontSize: '0.9rem', color: '#94a3b8', marginRight: '8px' }}>
                {(product.price * 1.25).toFixed(2)} TL
            </span>
            {product.price.toFixed(2)} TL
          </div>
          <button className="add-to-cart-btn" onClick={handlePayment} style={{ background: '#22c55e' }}>
            <CreditCard size={16} />
            Hemen Öde
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


