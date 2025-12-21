import { ShoppingCart, Gift, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react'; // Added useState import
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { itemCount } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Added state for mobile menu

  const toggleMobileMenu = () => { // Added toggle function for mobile menu
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        {/* Logo Section */}
        <Link to="/" className="brand">
          <Gift className="brand-icon" size={28} color="var(--accent-gold)" />
          <span className="brand-name">EmekShop</span>
        </Link>

        {/* Navigation Links */}

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Center Links - Toggle class based on state */}
        <div className={`nav-center ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/products" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Ürünler</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutDashboard /> {/* Assuming FashieldAlt was a typo and LayoutDashboard is intended or FashieldAlt needs to be imported */}
              <span>{t('nav.admin')}</span>
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
