import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicFamilies, getMediaUrl } from '../../utils/api';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/Home.css';

function Home() {
  const { language, setLanguage, t, getField } = useLanguage();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicFamilies()
      .then((data) => {
        setFamilies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="home-loading">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero__title">{t('app_title')}</h1>
        <p className="hero__subtitle">
          {language === 'en' 
            ? 'Preserving our family stories, honoring our roots, and connecting generations through cherished memories.'
            : 'നമ്മുടെ കുടുംബ കഥകൾ സംരക്ഷിക്കുക, വേരുകളെ ആദരിക്കുക, വിലയേറിയ ഓർമ്മകളിലൂടെ തലമുറകളെ തമ്മിൽ ബന്ധിപ്പിക്കുക.'}
        </p>
      </section>

      <section className="featured-families">
        <h2 className="section-title">{t('featured_families')}</h2>
        <div className="family-grid">
          {families.map((family) => (
            <Link to={`/family/${family.slug}`} key={family.id} className="family-card-link">
              <Card className="family-card">
                <div
                  className="family-card__cover"
                  style={family.cover_photo ? { backgroundImage: `url(${getMediaUrl(family.cover_photo)})` } : undefined}
                >
                  {!family.cover_photo && (
                    <div className="family-card__placeholder">
                      {getField(family, 'name').charAt(0)}
                    </div>
                  )}
                </div>
                <Card.Body>
                  <h3 className="family-card__name">{getField(family, 'name')}</h3>
                  {family.motto && (
                    <p className="family-card__motto">
                      &ldquo;{getField(family, 'motto')}&rdquo;
                    </p>
                  )}
                  <p className="family-card__desc">{getField(family, 'description')}</p>
                </Card.Body>
                <Card.Footer>
                  <span className="family-card__count">
                    {family.member_count} {t('members_count')}
                  </span>
                </Card.Footer>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
