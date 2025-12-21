import React, { createContext, useState, useContext } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Navbar
    'nav.home': 'Anasayfa',
    'nav.products': 'Ürünler',
    'nav.about': 'Hakkımızda',
    'nav.contact': 'İletişim',
    'nav.adminPanel': 'Admin Paneli',
    'nav.signIn': 'Giriş Yap',
    'nav.hello': 'Merhaba',
    'nav.logout': 'Çıkış',
    'nav.profile': 'Profilim',
    
    // Pages
    'about.title': 'Hakkımızda',
    'about.content': 'EmekShop, müşteri memnuniyetini en üst düzeyde tutmayı ilke edinmiş, yeni nesil bir e-ticaret platformudur. Lüks ve kaliteyi herkes için ulaşılabilir kılmak amacıyla çıktığımız bu yolda, şeffaflık ve güven en temel değerlerimizdir. Her alışverişinizde size özel olduğunuzu hissettirmek için buradayız.',
    'contact.title': 'Bize Ulaşın',
    'contact.formTitle': 'İletişim Formu',
    'contact.send': 'Gönder',
    'products.title': 'Tüm Ürünlerimiz',
    'profile.title': 'Profil Bilgilerim',
    'profile.orders': 'Geçmiş Siparişlerim',
    'profile.phone': 'Telefon Numarası',
    'profile.address': 'Adres Bilgisi',
    'profile.save': 'Bilgileri Kaydet',
    'profile.success': 'Bilgiler başarıyla güncellendi.',
    'footer.copyright': '© 2025 EmekShop. Tüm hakları saklıdır.',
    'footer.legal': 'Yasal Uyarı: Bu sitedeki tüm içerik ve görseller Fikir ve Sanat Eserleri Kanunu kapsamında korunmaktadır.',
    
    // Hero
    'hero.title': 'Mutlu Yıllar',
    'hero.subtitle': 'Kutu oyunlarından yılbaşı süslerine, sevdikleriniz için en güzel hediyelerden parti malzemelerine kadar aradığınız her şey burada.',
    'hero.cta': 'Ürünleri İncele',
    
    // Features
    'feat.premium.title': 'Eğlence',
    'feat.premium.desc': 'Yılbaşı gecesi için en zevkli oyunlar, aktiviteler ve hediyeler burada.',
    'feat.offers.title': 'Güvenli Ödeme',
    'feat.offers.desc': '%100 Güvenli ödeme altyapısı ile gönül rahatlığıyla alışveriş yapın.',
    'feat.wrapping.title': 'Hızlı Teslimat',
    'feat.wrapping.desc': 'Siparişleriniz hızlıca kapınıza kadar gelir.',
    'feat.deals.title': 'Fırsat Köşesi',
    'feat.deals.desc': 'Sezonun en çok aranan ürünlerinde kaçırılmayacak indirimler',
    
    // Home Content
    'home.featured': '',
    'home.products': 'Yılbaşı Ürünleri',
    'home.noProducts': 'Henüz ürün eklenmemiş.',
    
    // Product Card
    'product.premium': 'Fırsat',
    'product.handpicked': 'Yılbaşı Özel',
    'product.addToCart': 'Sepete Ekle',
    
    // Auth
    'auth.createAccount': 'Hesap Oluştur',
    'auth.welcomeBack': 'Tekrar Hoşgeldiniz',
    'auth.fullName': 'Ad Soyad',
    'auth.email': 'E-posta Adresi',
    'auth.password': 'Şifre',
    'auth.confirmPassword': 'Şifreyi Onayla',
    'auth.signUp': 'Kayıt Ol',
    'auth.signIn': 'Giriş Yap',
    'auth.alreadyAccount': 'Zaten bir hesabınız var mı? ',
    'auth.noAccount': 'Hesabınız yok mu? ',
    'auth.passwordMismatch': 'Şifreler eşleşmiyor',
    
    // Admin
    'admin.dashboard': 'Yönetici Paneli',
    'admin.tab.products': 'Ürünler',
    'admin.tab.users': 'Kullanıcılar',
    'admin.tab.orders': 'Siparişler',
    'admin.tab.messages': 'Gelen Kutusu',
    'admin.addProduct': 'Yeni Ürün Ekle',
    'admin.ph.name': 'Ürün Adı',
    'admin.ph.price': 'Fiyat',
    'admin.ph.category': 'Kategori',
    'admin.ph.image': 'Resim URL',
    'admin.ph.desc': 'Açıklama',
    'admin.btnAdd': 'Ürün Ekle',
    'admin.allProducts': 'Tüm Ürünler',
    'admin.userMgmt': 'Kullanıcı Yönetimi',
    'admin.recentOrders': 'Son Siparişler',
    'admin.inbox': 'Gelen Mesajlar',
    'admin.noMessages': 'Henüz mesaj yok.',
    'admin.noOrders': 'Henüz sipariş yok.',

    // Cart
    'cart.title': 'Sepetim',
    'cart.empty': 'Sepetinizde ürün bulunmamaktadır.',
    'cart.total': 'Toplam Tutar',
    'cart.checkout': 'Ödemeye Geç',
    'cart.continue': 'Alışverişe Devam Et',
    'cart.remove': 'Kaldır',
    'cart.table.product': 'Ürün',
    'cart.table.price': 'Fiyat',
    'cart.table.quantity': 'Adet',
    'cart.table.total': 'Toplam',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.adminPanel': 'Admin Panel',
    'nav.signIn': 'Sign In',
    'nav.hello': 'Hello',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    
    // Pages
    'about.title': 'About Us',
    'about.content': 'EmekShop is a new generation e-commerce platform dedicated to maximizing customer satisfaction. On this journey to make luxury and quality accessible to everyone, transparency and trust are our core values. We are here to make you feel special with every purchase.',
    'contact.title': 'Contact Us',
    'contact.formTitle': 'Contact Form',
    'contact.send': 'Send',
    'products.title': 'All Products',
    'profile.title': 'My Profile',
    'profile.orders': 'My Orders',
    'profile.phone': 'Phone Number',
    'profile.address': 'Address',
    'profile.save': 'Save Info',
    'profile.success': 'Information updated successfully.',
    'footer.copyright': '© 2025 EmekShop. All rights reserved.',
    'footer.legal': 'Legal Disclaimer: All content and images on this site are protected under intellectual property laws.',
    
    // Hero
    'hero.title': 'Happy New Year',
    'hero.subtitle': 'From board games to Christmas ornaments, finding the perfect gifts and party supplies is easy.',
    'hero.cta': 'Shop Now',
    
    // Features
    'feat.premium.title': 'Fun Filled',
    'feat.premium.desc': 'The most enjoyable board games and activities for New Year\'s Eve.',
    'feat.offers.title': 'Deal Corner',
    'feat.offers.desc': 'Unmissable discounts on the most sought-after products of the season.',
    'feat.wrapping.title': 'Careful Packaging',
    'feat.wrapping.desc': 'Your orders are packaged safely and carefully delivered to your door.',
    'feat.deals.title': 'Deal Corner',
    'feat.deals.desc': 'Unmissable discounts on the most sought-after products of the season.',
    
    // Home Content
    'home.featured': '',
    'home.products': 'Christmas Products',
    'home.noProducts': 'No products found.',
    
    // Product Card
    'product.premium': 'DEAL',
    'product.handpicked': 'New Year Special',
    'product.addToCart': 'Add to Cart',
    
    // Auth
    'auth.createAccount': 'Create Account',
    'auth.welcomeBack': 'Welcome Back',
    'auth.fullName': 'Full Name',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.signUp': 'Sign Up',
    'auth.signIn': 'Sign In',
    'auth.alreadyAccount': 'Already have an account? ',
    'auth.noAccount': 'Don\'t have an account? ',
    'auth.passwordMismatch': 'Passwords don\'t match',

    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.tab.products': 'Products',
    'admin.tab.users': 'Users',
    'admin.tab.orders': 'Orders',
    'admin.addProduct': 'Add New Product',
    'admin.ph.name': 'Product Name',
    'admin.ph.price': 'Price',
    'admin.ph.category': 'Category',
    'admin.ph.image': 'Image URL',
    'admin.ph.desc': 'Description',
    'admin.btnAdd': 'Add Product',
    'admin.allProducts': 'All Products',
    'admin.userMgmt': 'User Management',
    'admin.recentOrders': 'Recent Orders',
    'admin.noOrders': 'No orders yet.',

    // Cart
    'cart.title': 'My Cart',
    'cart.empty': 'Your cart is empty.',
    'cart.total': 'Total Amount',
    'cart.checkout': 'Checkout',
    'cart.continue': 'Continue Shopping',
    'cart.remove': 'Remove',
    'cart.table.product': 'Product',
    'cart.table.price': 'Price',
    'cart.table.quantity': 'Quantity',
    'cart.table.total': 'Total',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('tr');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
