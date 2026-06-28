import { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/AdminTable.css';
import '../../styles/AdminSettings.css';
import '../../styles/AdminHomeContent.css';

const FIELDS = [
  {
    section: 'Banner Quote',
    keys: ['home_banner_quote_en', 'home_banner_quote_ml'],
    label: 'Banner Quote',
    labelMl: 'ബാനർ ഉദ്ധരണി',
    type: 'text',
    icon: '📜',
    hint: 'The quote displayed on the hero banner',
    hintMl: 'ഹീറോ ബാനറിൽ പ്രദർശിപ്പിച്ചിരിക്കുന്ന ഉദ്ധരണി',
  },
  {
    section: 'Banner Citation',
    keys: ['home_banner_cite_en', 'home_banner_cite_ml'],
    label: 'Banner Citation',
    labelMl: 'ബാനർ അവലംബം',
    type: 'text',
    icon: '✍️',
    hint: 'Attribution for the banner quote',
    hintMl: 'ബാനർ ഉദ്ധരണിയുടെ ഉറവിടം',
  },
  {
    section: 'Mission Title',
    keys: ['home_mission_title_en', 'home_mission_title_ml'],
    label: 'Mission Title',
    labelMl: 'മിഷൻ ശീർഷകം',
    type: 'text',
    icon: '🎯',
    hint: 'Section heading for the mission statement',
    hintMl: 'മിഷൻ പ്രസ്താവനയുടെ വിഭാഗം തലക്കെട്ട്',
  },
  {
    section: 'Mission Text',
    keys: ['home_mission_text_en', 'home_mission_text_ml'],
    label: 'Mission Text',
    labelMl: 'മിഷൻ വിവരണം',
    type: 'textarea',
    icon: '📖',
    hint: 'The main descriptive paragraph about the family heritage',
    hintMl: 'കുടുംബ പൈതൃകത്തെക്കുറിച്ചുള്ള പ്രധാന വിവരണ ഖണ്ഡിക',
  },
  {
    section: 'CTA Title',
    keys: ['home_cta_title_en', 'home_cta_title_ml'],
    label: 'CTA Title',
    labelMl: 'കോൾ ടു ആക്ഷൻ ശീർഷകം',
    type: 'text',
    icon: '💬',
    hint: 'Call-to-action section heading',
    hintMl: 'കോൾ ടു ആക്ഷൻ വിഭാഗത്തിന്റെ തലക്കെട്ട്',
  },
  {
    section: 'CTA Text',
    keys: ['home_cta_text_en', 'home_cta_text_ml'],
    label: 'CTA Text',
    labelMl: 'കോൾ ടു ആക്ഷൻ വിവരണം',
    type: 'textarea',
    icon: '📢',
    hint: 'Call-to-action paragraph encouraging users to explore',
    hintMl: 'ഉപയോക്താക്കളെ പ്രോത്സാഹിപ്പിക്കുന്ന കോൾ ടു ആക്ഷൻ ഖണ്ഡിക',
  },
];

const DEFAULT_VALUES = {};
FIELDS.forEach((f) => {
  f.keys.forEach((k) => { DEFAULT_VALUES[k] = ''; });
});

function LangTag({ lang }) {
  return (
    <span className={'home-content__lang-tag home-content__lang-tag--' + lang}>
      {lang === 'en' ? 'English' : 'മലയാളം'}
    </span>
  );
}

export default function AdminHomeContent() {
  const [values, setValues] = useState({ ...DEFAULT_VALUES });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSettings();
        setValues((prev) => {
          const next = { ...prev };
          Object.keys(data).forEach((k) => {
            if (k in next) next[k] = data[k];
          });
          return next;
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateSettings(values);
      setSuccess('Home page content saved successfully.');
      setDirty(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="home-content">
      <div className="page-header">
        <h1 className="page-title">Home Page Content</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="settings-sections">
          {FIELDS.map((f, idx) => {
            const enKey = f.keys[0];
            const mlKey = f.keys[1];
            return (
              <Card key={idx} className="home-content__card">
                <div className="home-content__card-header">
                  <div className="home-content__card-icon">{f.icon}</div>
                  <div>
                    <h3 className="home-content__card-title">{f.label}</h3>
                    <div className="home-content__card-title" style={{
                      fontSize: '0.8rem', fontWeight: 400,
                      color: '#64748b', marginTop: '0.15rem',
                    }}>
                      {f.labelMl}
                    </div>
                  </div>
                </div>
                <div className="home-content__card-body">
                  <div className="home-content__lang-row">
                    <div className="home-content__field">
                      <LangTag lang="en" />
                      {f.type === 'textarea' ? (
                        <textarea
                          className="home-content__input home-content__input--textarea"
                          value={values[enKey] || ''}
                          onChange={(e) => handleChange(enKey, e.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="home-content__input"
                          value={values[enKey] || ''}
                          onChange={(e) => handleChange(enKey, e.target.value)}
                        />
                      )}
                      <div className="home-content__char-count">
                        {(values[enKey] || '').length} characters
                      </div>
                    </div>
                    <div className="home-content__field">
                      <LangTag lang="ml" />
                      {f.type === 'textarea' ? (
                        <textarea
                          className="home-content__input home-content__input--textarea"
                          value={values[mlKey] || ''}
                          onChange={(e) => handleChange(mlKey, e.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="home-content__input"
                          value={values[mlKey] || ''}
                          onChange={(e) => handleChange(mlKey, e.target.value)}
                        />
                      )}
                      <div className="home-content__char-count">
                        {(values[mlKey] || '').length} characters
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="settings-footer">
          <div className="settings-status">
            {error && <div className="settings-msg settings-msg--error">{error}</div>}
            {success && <div className="settings-msg settings-msg--success">{success}</div>}
          </div>
          {dirty && <div className="settings-unsaved">You have unsaved changes</div>}
          <Button type="submit" disabled={saving || !dirty} size="lg">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
