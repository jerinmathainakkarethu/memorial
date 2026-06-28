import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicFamilies, fetchPublicSettings, getMediaUrl } from '../../utils/api';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLanguage } from '../../context/LanguageContext';
import { useInView } from '../../hooks/useInView';
import '../../styles/Home.css';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function FloatingParticles({ count = 12 }) {
  return (
    <div className="floating-particles" aria-hidden="true">
      {[...Array(count)].map((_, i) => (
        <span key={i} className="floating-particles__dot" style={{
          left: `${(i * 8.3) % 100}%`,
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${4 + (i % 3) * 2}s`,
          width: `${2 + (i % 3)}px`,
          height: `${2 + (i % 3)}px`,
          opacity: 0.3 + (i % 4) * 0.15,
        }} />
      ))}
    </div>
  )
}

function c(val, fallback) {
  return val || fallback;
}

function Home() {
  const { language, t, getField } = useLanguage();
  const [families, setFamilies] = useState([]);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const en = language === 'en';

  useEffect(() => {
    Promise.all([
      fetchPublicFamilies(),
      fetchPublicSettings(),
    ])
      .then(([familiesData, settings]) => {
        setFamilies(familiesData);
        setContent(settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
      {/* Banner Hero */}
      <section className="home-banner">
        <div className="home-banner__bg" />
        <div className="home-banner__overlay" />
        <FloatingParticles count={16} />
        <AnimatedSection className="home-banner__content">
          <div className="home-banner__emblem">🕊️</div>
          <h1 className="home-banner__title">{t('app_title')}</h1>
          <blockquote className="home-banner__quote">
            {c(content['home_banner_quote_' + language], en
              ? '"Those who do not remember the past are condemned to repeat it."'
              : '"ഭൂതകാലത്തെ ഓർക്കാത്തവർ അത് ആവർത്തിക്കാൻ വിധിക്കപ്പെടുന്നു."')}
          </blockquote>
          <cite className="home-banner__cite">
            {c(content['home_banner_cite_' + language], en ? '— George Santayana' : '— ജോർജ് സന്തായന')}
          </cite>
        </AnimatedSection>
      </section>

      {/* Mission */}
      <section className="mission">
        <AnimatedSection className="mission__inner">
          <h2 className="mission__title">
            {c(content['home_mission_title_' + language], en ? 'Our Family Heritage' : 'നമ്മുടെ കുടുംബ പൈതൃകം')}
          </h2>
          <div className="section-accent" />
          <p className="mission__text">
            {c(content['home_mission_text_' + language], en
              ? 'This memorial is a living archive of our family history — a place where stories are preserved, photos are cherished, and the flame of memory never fades. Explore the branches of our family tree, light a candle in loving memory, and leave your tribute for generations to come.'
              : 'ഈ സ്മരണിക നമ്മുടെ കുടുംബ ചരിത്രത്തിന്റെ ഒരു ജീവിക്കുന്ന ശേഖരമാണ് — കഥകൾ സംരക്ഷിക്കപ്പെടുകയും ഫോട്ടോകൾ വിലമതിക്കപ്പെടുകയും ഓർമ്മകളുടെ ജ്വാല ഒരിക്കലും കെടാതിരിക്കുകയും ചെയ്യുന്ന ഒരു സ്ഥലം. നമ്മുടെ കുടുംബ വൃക്ഷത്തിന്റെ ശാഖകളിലൂടെ സഞ്ചരിക്കുക, പ്രിയപ്പെട്ടവരുടെ ഓർമ്മയ്ക്കായി മെഴുകുതിരി കൊളുത്തുക, വരും തലമുറകൾക്കായി നിങ്ങളുടെ ആദരാഞ്ജലി രേഖപ്പെടുത്തുക.')}
          </p>
        </AnimatedSection>
      </section>

      {/* Featured Families */}
      <section className="featured-families">
        <AnimatedSection className="featured-families__header">
          <h2 className="section-title">{t('featured_families')}</h2>
          <div className="section-accent" />
        </AnimatedSection>

        {families.length === 0 ? (
          <AnimatedSection delay={100}>
            <div className="no-families">
              {en
                ? 'No families have been added yet.'
                : 'ഇതുവരെ കുടുംബങ്ങളെ ചേർത്തിട്ടില്ല.'}
            </div>
          </AnimatedSection>
        ) : (
          <div className="family-grid">
            {families.map((family, index) => (
              <AnimatedSection key={family.id} delay={100 + index * 80}>
                <Link to={'/family/' + family.slug} className="family-card-link">
                  <Card className="family-card">
                    <div
                      className="family-card__cover"
                      style={family.cover_photo ? { backgroundImage: 'url(' + getMediaUrl(family.cover_photo) + ')' } : undefined}
                    >
                      {!family.cover_photo && (
                        <div className="family-card__placeholder">
                          {getField(family, 'name').charAt(0)}
                        </div>
                      )}
                      <div className="family-card__cover-overlay" />
                    </div>
                    <Card.Body>
                      <h3 className="family-card__name">{getField(family, 'name')}</h3>
                      {family.motto && (
                        <p className="family-card__motto">&ldquo;{getField(family, 'motto')}&rdquo;</p>
                      )}
                      <p className="family-card__desc">{getField(family, 'description')}</p>
                      <div className="family-card__counts">
                        <span className="family-card__count">
                          👤 {family.member_count || 0} {t('members_count')}
                        </span>
                        {family.departed_count > 0 && (
                          <span className="family-card__count family-card__count--departed">
                            🕊️ {family.departed_count} {t('departed_count')}
                          </span>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="home-cta">
        <AnimatedSection className="home-cta__inner">
          <h2 className="home-cta__title">
            {c(content['home_cta_title_' + language], en ? 'Preserve Your Family Story' : 'നിങ്ങളുടെ കുടുംബ കഥ സംരക്ഷിക്കുക')}
          </h2>
          <p className="home-cta__text">
            {c(content['home_cta_text_' + language], en
              ? 'Our family legacy is built on the lives we live and the memories we share. Every name, every face, every story matters.'
              : 'നമ്മുടെ കുടുംബ പാരമ്പര്യം നാം ജീവിക്കുന്ന ജീവിതങ്ങളിലും പങ്കിടുന്ന ഓർമ്മകളിലും നിർമ്മിച്ചിരിക്കുന്നു. ഓരോ പേരും, ഓരോ മുഖവും, ഓരോ കഥയും പ്രധാനമാണ്.')}
          </p>
        </AnimatedSection>
      </section>
    </div>
  );
}

export default Home;
