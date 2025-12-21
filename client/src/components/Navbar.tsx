import { ShoppingCart, Gift, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { itemCount } = useCart();

  return (
    <nav className="navbar">
      <div className="container nav-content">
        {/* Logo Section */}
        <Link to="/" className="brand">
          <Gift className="brand-icon" size={28} color="var(--accent-gold)" />
          <span className="brand-name">EmekShop</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-center">
          <Link to="/" className="nav-link">{t('nav.home')}</Link>
          <Link to="/products" className="nav-link">{t('nav.products')}</Link>
          <Link to="/about" className="nav-link">{t('nav.about')}</Link>
          <Link to="/contact" className="nav-link">{t('nav.contact')}</Link>
          {user?.result?.role === 'admin' && (
              <Link to="/admin" className="nav-link admin-link">
                  <LayoutDashboard size={18}/> {t('nav.adminPanel')}
              </Link>
          )}
        </div>

        {/* Right Actions: Lang, Cart, Auth */}
        <div className="nav-actions">
           <div className="lang-switcher">
              <button 
                  className={`lang-btn ${language === 'tr' ? 'active' : ''}`} 
                  onClick={() => setLanguage('tr')}
              >
                TR
              </button>
              <div className="divider">|</div>
              <button 
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
                  onClick={() => setLanguage('en')}
              >
                EN
              </button>
           </div>

          <div className="auth-actions">
            {user ? (
                <div className="user-profile">
                    <Link to="/profile" className="user-name" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                        {user.result.name.split(' ')[0]}
                    </Link>
                    <button onClick={logout} className="icon-btn" title={t('nav.logout')}>
                        <LogOut size={20} />
                    </button>
                </div>
            ) : (
                <Link to="/login" className="login-link">
                    <User size={20} /> {t('nav.signIn')}
                </Link>
            )}
          </div>

          <Link to="/cart" className="cart-btn" style={{ textDecoration: 'none' }}>
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
