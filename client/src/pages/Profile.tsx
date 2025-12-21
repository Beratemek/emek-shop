import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Package, Smartphone, MapPin, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { updateUser } from '../api';

const Profile = () => {
    const { user, updateUserContext } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        phone: user?.result?.phone || '',
        address: user?.result?.address || ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
             // Populate if user already has data (requires user object refetch or update in context ideally, 
             // but for now we trust the user object or what edits we make locally)
             setFormData({
                 phone: user.result.phone || '',
                 address: user.result.address || ''
             });
        }
    }, [user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if(user?.result?._id) {
                const { data } = await updateUser(user.result._id, formData);
                // Ideally, we should update the Auth Context user here with the new data
                // For this quick implementation, we will update local storage or just show success
                // user.result = data; (this won't trigger re-render properly without context method)
                
                // Let's assume we just show success for now, 
                // in a real app create updateProfile in AuthContext
                const updatedProfile = { ...user, result: data };
                localStorage.setItem('profile', JSON.stringify(updatedProfile));
                // We need to update the context state. Since we can't directly access setUser here without changing AuthContext, 
                // we will modify AuthContext to include a method for this.
                // For this step I'll just remove the reload and rely on the fact that I will add an update function to AuthContext next.
                updateUserContext(updatedProfile);
                
                setMessage(t('profile.success'));
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!user) return null;

    return (
        <div className="container" style={{ marginTop: '100px', padding: '20px' }}>
            <h1 className="section-title">{t('profile.title')}</h1>
            
            <div style={{ display: 'grid', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
                {/* User Info Card */}
                <div className="glass" style={{ padding: '30px', borderRadius: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>
                            {user.result.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ color: 'white', marginBottom: '5px' }}>{user.result.name}</h2>
                            <p style={{ color: '#94a3b8' }}>{user.result.email}</p>
                            {/* Premium badge removed as requested */}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                         <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Smartphone size={16} color="#fbbf24"/> {t('profile.phone')}
                            </label>
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                placeholder="+90 555 123 45 67"
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                            />
                         </div>

                         <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={16} color="#fbbf24"/> {t('profile.address')}
                            </label>
                            <textarea 
                                name="address" 
                                value={formData.address} 
                                onChange={handleChange} 
                                placeholder="Açık adresiniz..."
                                rows={3}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', resize: 'none', fontFamily: 'inherit' }}
                            />
                         </div>

                         <button type="submit" className="cta-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Save size={18} /> {t('profile.save')}
                         </button>
                         {message && <p style={{ color: '#4ade80', textAlign: 'center' }}>{message}</p>}
                    </form>
                </div>

                {/* Orders Section */}
                <div className="glass" style={{ padding: '30px', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Package color="#fbbf24" />
                        {t('profile.orders')}
                    </h3>
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                        No orders found.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
