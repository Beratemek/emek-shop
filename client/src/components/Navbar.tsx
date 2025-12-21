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

        {/* Mobile Menu Button - Moved to right side via CSS order or placement */}
        <div className="mobile-actions">
            <Link to="/cart" className="cart-btn mobile-cart">
              <ShoppingCart size={20} />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
            </button>
        </div>

        {/* Desktop Actions (Hidden on Mobile) */}
        <div className="nav-actions desktop-actions">
          <div className="lang-switcher">
            <button 
              className={`lang-btn ${language === 'tr' ? 'active' : ''}`}
              onClick={() => setLanguage('tr')}
            >
              TR
            </button>
            <span className="divider">|</span>
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
                <Link to="/profile" className="user-name">{user.result.name}</Link>
                 <button onClick={logout} className="icon-btn" title={t('auth.logout')}>
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-link">
                <User size={18} />
                <span>{t('auth.signIn')}</span>
              </Link>
            )}
          </div>

          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`nav-center ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/products" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Ürünler</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</Link>

          {(user?.role === 'admin' || user?.result?.role === 'admin') && (
            <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutDashboard size={18} />
              <span>{t('nav.admin')}</span>
            </Link>
          )}

          {/* Mobile Menu Footer Actions */}
          <div className="mobile-menu-footer">
               <div className="auth-actions mobile-auth">
                {user ? (
                  <div className="user-profile">
                    <Link to="/profile" className="user-name" onClick={() => setIsMobileMenuOpen(false)}>{user.result.name}</Link>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="icon-btn">
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="login-link" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={18} />
                    <span>{t('auth.signIn')}</span>
                  </Link>
                )}
              </div>

             <div className="lang-switcher mobile-lang">
                <button className={`lang-btn ${language === 'tr' ? 'active' : ''}`} onClick={() => setLanguage('tr')}>TR</button>
                <span className="divider">|</span>
                <button className={`lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</button>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
