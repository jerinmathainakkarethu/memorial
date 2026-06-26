import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMemberBySlug, incrementScan } from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/LoadingSpinner.css';

function QrRedirect() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function handleRedirect() {
      try {
        const member = await fetchMemberBySlug(slug);
        if (!active) return;
        
        // Log scanning metrics in background
        try {
          await incrementScan(member.id);
        } catch (scanErr) {
          console.error('Failed to log scan count:', scanErr);
        }

        // Redirect to family page with highlight parameter
        navigate(`/family/${member.family_slug}?highlight=${slug}`, { replace: true });
      } catch (err) {
        if (active) {
          console.error(err);
          setError(t('not_found'));
        }
      }
    }

    handleRedirect();

    return () => {
      active = false;
    };
  }, [slug, navigate, t]);

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#0F172A' }}>
        <h2>{error}</h2>
        <button 
          onClick={() => navigate('/')} 
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {t('home')}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <LoadingSpinner />
      <p style={{ marginTop: '20px', color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
        {t('loading')}
      </p>
    </div>
  );
}

export default QrRedirect;
