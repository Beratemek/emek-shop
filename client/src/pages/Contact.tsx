import { useState } from 'react';
import { createMessage } from '../api';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMessage(formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.log(error);
            setStatus('error');
        }
    };

    return (
        <div className="container" style={{ marginTop: '100px', padding: '20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="section-title">{t('contact.title')}</h1>
            
            <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '40px', borderRadius: '15px' }}>
                <h3 style={{ marginBottom: '20px', color: '#fbbf24', textAlign: 'center' }}>{t('contact.formTitle')}</h3>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group">
                        <input name="name" value={formData.name} onChange={handleChange} required type="text" placeholder="Adınız Soyadınız" style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                    </div>
                    <div className="input-group">
                        <input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="E-posta Adresiniz" style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                    </div>
                    <div className="input-group">
                        <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Mesajınız..." rows={6} style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', resize: 'none', fontFamily: 'inherit' }}></textarea>
                    </div>
                    <button type="submit" className="cta-button" style={{ width: '100%', marginTop: '10px' }}>{t('contact.send')}</button>
                    {status === 'success' && <p style={{ color: '#4ade80', textAlign: 'center' }}>Mesajınız başarıyla gönderildi.</p>}
                    {status === 'error' && <p style={{ color: '#ef4444', textAlign: 'center' }}>Bir hata oluştu. Lütfen tekrar deneyin.</p>}
                </form>
            </div>
        </div>
    );
};

export default Contact;
