import { useState, useEffect } from 'react';
import { fetchProducts } from '../api';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

const Products = () => {
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
        <div className="container" style={{ marginTop: '100px', padding: '20px' }}>
            <h1 className="section-title">{t('products.title')}</h1>
            <div className="products-grid">
               {products.length === 0 ? <p style={{textAlign: 'center', width: '100%', color: '#999'}}>{t('home.noProducts')}</p> : null}
               {products.map((product: any) => (
                 <ProductCard key={product._id} product={product} />
               ))}
             </div>
        </div>
    );
};

export default Products;
