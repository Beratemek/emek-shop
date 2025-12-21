import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

import { Link } from 'react-router-dom';

const ProductCard = ({ product }: { product: ProductProps }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();

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
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            <ShoppingCart size={16} />
            {t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
