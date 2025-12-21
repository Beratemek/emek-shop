/* Existing imports... */
import { useState, useEffect } from 'react';
import { fetchProducts, fetchUsers, fetchOrders, createProduct, deleteProduct, updateProduct, deleteUser, fetchMessages, deleteMessage } from '../api';
import { Trash2, Plus, Package, Users, ShoppingBag, Edit2, X, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const { t } = useLanguage();
  
  // Product Form State
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [productData, setProductData] = useState({ name: '', price: '', description: '', image: '', category: '' });

  useEffect(() => {
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'messages') loadMessages();
  }, [activeTab]);

  const loadProducts = async () => {
    const { data } = await fetchProducts();
    setProducts(data);
  };

  const loadUsers = async () => {
    const { data } = await fetchUsers();
    setUsers(data);
  };

  const loadOrders = async () => {
    const { data } = await fetchOrders();
    setOrders(data);
  };

  const loadMessages = async () => {
      const { data } = await fetchMessages();
      setMessages(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentId) {
        await updateProduct(currentId, productData);
    } else {
        await createProduct(productData);
    }
    clearForm();
    loadProducts();
  };

  const clearForm = () => {
      setCurrentId(null);
      setProductData({ name: '', price: '', description: '', image: '', category: '' });
  };

  const handleEdit = (product: any) => {
      setCurrentId(product._id);
      setProductData({ 
        name: product.name, 
        price: product.price, 
        description: product.description, 
        image: product.image, 
        category: product.category 
      });
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: string) => {
    if(window.confirm('Are you sure?')) {
        await deleteProduct(id);
        loadProducts();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if(window.confirm('Are you sure?')) {
        await deleteUser(id);
        loadUsers();
    }
  };

  const handleDeleteMessage = async (id: string) => {
      if(window.confirm('Mesajı silmek istediğinize emin misiniz?')) {
          await deleteMessage(id);
          loadMessages();
      }
  };

  return (
    <div className="admin-container container">
      <h1 className="admin-title">{t('admin.dashboard')}</h1>
      
      <div className="admin-tabs">
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
            <Package size={18}/> {t('admin.tab.products')}
        </button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <Users size={18}/> {t('admin.tab.users')}
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <ShoppingBag size={18}/> {t('admin.tab.orders')}
        </button>
        <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            <Mail size={18}/> {t('admin.tab.messages')}
        </button>
      </div>

      <div className="admin-content glass">
        {activeTab === 'products' && (
          <div>
            <h3>{currentId ? 'Ürünü Düzenle' : t('admin.addProduct')}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <input value={productData.name} onChange={(e) => setProductData({...productData, name: e.target.value})} placeholder={t('admin.ph.name')} required />
              <input value={productData.price} onChange={(e) => setProductData({...productData, price: e.target.value})} placeholder={t('admin.ph.price')} type="number" required />
              <input value={productData.category} onChange={(e) => setProductData({...productData, category: e.target.value})} placeholder={t('admin.ph.category')} />
              <input value={productData.image} onChange={(e) => setProductData({...productData, image: e.target.value})} placeholder={t('admin.ph.image')} />
              <textarea value={productData.description} onChange={(e) => setProductData({...productData, description: e.target.value})} placeholder={t('admin.ph.desc')} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="add-btn">
                      {currentId ? <Edit2 size={16}/> : <Plus size={16}/>} 
                      {currentId ? 'Güncelle' : t('admin.btnAdd')}
                  </button>
                  {currentId && (
                      <button type="button" onClick={clearForm} className="delete-btn" style={{ width: 'auto', padding: '0 20px', background: '#64748b' }}>
                          <X size={16} /> İptal
                      </button>
                  )}
              </div>
            </form>

            <h3>{t('admin.allProducts')}</h3>
            <div className="admin-list">
              {products.map(p => (
                <div key={p._id} className="admin-item">
                  <div className="info">
                    <span className="name">{p.name}</span>
                    <span className="price">{p.price} TL</span>
                  </div>
                  <div className="actions" style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEdit(p)} className="edit-btn" style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteProduct(p._id)} className="delete-btn"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users and Orders tabs unchanged except mostly currency but orders displays full object details usually. For now just product listing updated. */}
        {activeTab === 'users' && (
          <div>
            <h3>{t('admin.userMgmt')}</h3>
            <div className="admin-list">
              {users.map(u => (
                <div key={u._id} className="admin-item">
                   <div className="info">
                     <span className="name">{u.name}</span>
                     <span className="email">{u.email}</span>
                     <span className="role-badge">{u.role}</span>
                   </div>
                   {u.role !== 'admin' && (
                       <button onClick={() => handleDeleteUser(u._id)} className="delete-btn"><Trash2 size={16} /></button>
                   )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h3>{t('admin.recentOrders')}</h3>
            <div className="admin-list">
                {orders.length === 0 && <p>{t('admin.noOrders')}</p>}
                {orders.map(order => (
                    <div key={order._id} className="admin-item order-item">
                        <div className="info">
                            <span className="order-id">#{order._id.slice(-6)}</span>
                            <span className="customer">{order.guestInfo?.name || 'User'}</span>
                            <span className="amount">{order.totalAmount} TL</span>
                            <span className={`status ${order.status}`}>{order.status}</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <h3>{t('admin.inbox')}</h3>
            <div className="admin-list">
                {messages.length === 0 && <p className="no-data">{t('admin.noMessages')}</p>}
                {messages.map(msg => (
                    <div key={msg._id} className="admin-item message-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{msg.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{msg.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                <button onClick={() => handleDeleteMessage(msg._id)} className="delete-btn"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <p style={{ color: '#e2e8f0', fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', width: '100%' }}>
                            {msg.message}
                        </p>
                    </div>
                ))}
            </div>
          </div>
        )}
    </div>
  </div>
  );
};

export default Admin;
