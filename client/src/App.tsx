import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
// import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import SnowEffect from './components/SnowEffect';
import ProductCard from './components/ProductCard';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import { useState, useEffect } from 'react';
import { fetchProducts } from './api';
import './App.css';

const Home = () => {
   const navigate = useNavigate();
   const [products, setProducts] = useState<any[]>([]);
   const { t } = useLanguage();

   useEffect(() => {
     const getProducts = async () => {
        try {
            const { data } = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.log(error);
        }
     };
     getProducts();
   }, []);

   return (
    <>
      <div className="container">
        <section className="hero">
          <div className="glow-effect"></div>
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <button className="cta-button" onClick={() => navigate('/products')}>{t('hero.cta')}</button>
        </section>

        <section id="gifts" className="features-row">
           <div className="feature-box">
             <h3>{t('feat.premium.title')}</h3>
             <p>{t('feat.premium.desc')}</p>
           </div>
           <div className="feature-box">
             <h3>{t('feat.offers.title')}</h3>
             <p>{t('feat.offers.desc')}</p>
           </div>
           <div className="feature-box">
             <h3>{t('feat.wrapping.title')}</h3>
             <p>{t('feat.wrapping.desc')}</p>
           </div>
           <div className="feature-box">
             <h3>{t('feat.deals.title')}</h3>
             <p>{t('feat.deals.desc')}</p>
           </div>
        </section>

        <section id="collection">
          <h2 className="section-title"><span>{t('home.products')}</span></h2>
          <div className="products-grid">
            {products.length === 0 ? <p style={{textAlign: 'center', width: '100%', color: '#999'}}>{t('home.noProducts')}</p> : null}
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </>
   );
};

import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
// import Cart from './pages/Cart';

// ... existing Home component ...

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
            <div className="app">
              <SnowEffect />
              <Navbar />
              <Routes>
                 <Route path="/" element={<Home />} />
                 <Route path="/products" element={<Products />} />
                 <Route path="/product/:id" element={<ProductDetails />} />
                 <Route path="/about" element={<About />} />
                 <Route path="/contact" element={<Contact />} />
                 <Route path="/profile" element={<Profile />} />
                 <Route path="/login" element={<Auth isSignup={false} />} />
                 <Route path="/register" element={<Auth isSignup={true} />} />
                 <Route path="/auth" element={<Auth isSignup={false} />} />
                 <Route path="/auth/resetpassword/:token" element={<ResetPassword />} />
                 <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
