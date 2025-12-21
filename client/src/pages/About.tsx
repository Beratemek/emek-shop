import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Heart, Copyright } from 'lucide-react';

const About = () => {
    const { t } = useLanguage();
    return (
        <div className="container" style={{ marginTop: '100px', padding: '20px' }}>
            <h1 className="section-title">{t('about.title')}</h1>
            <div className="glass" style={{ padding: '50px', borderRadius: '15px', maxWidth: '800px', margin: '0 auto' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#e2e8f0' }}>
                        {t('about.content')}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '30px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <ShieldCheck size={40} color="#fbbf24" />
                            <span style={{ color: '#fbbf24', fontWeight: '600' }}>Güvenli Alışveriş</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <Heart size={40} color="#fbbf24" />
                            <span style={{ color: '#fbbf24', fontWeight: '600' }}>%100 Müşteri Memnuniyeti</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', marginBottom: '10px' }}>
                             <Copyright size={16} />
                             <span>{t('footer.copyright')}</span>
                         </div>
                         <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                             {t('footer.legal')}
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
