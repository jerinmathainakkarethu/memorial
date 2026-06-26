import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { lightCandle } from '../../utils/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import '../../styles/CandleSection.css';

function CandleSection({ memberId, initialCount }) {
  const { t } = useLanguage();
  const [count, setCount] = useState(initialCount || 0);
  const [isLit, setIsLit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCount(initialCount || 0);
    // Check if user already lit a candle for this member in this session
    const alreadyLit = localStorage.getItem(`candle_lit_${memberId}`);
    if (alreadyLit) {
      setIsLit(true);
    }
  }, [memberId, initialCount]);

  const handleLightCandle = async () => {
    if (isLit || loading) return;
    setLoading(true);
    try {
      const response = await lightCandle(memberId);
      setCount(response.candle_count);
      setIsLit(true);
      localStorage.setItem(`candle_lit_${memberId}`, 'true');
    } catch (err) {
      console.error('Failed to light candle:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="candle-section-card">
      <Card.Header className="candle-header">{t('light_candle')}</Card.Header>
      <Card.Body className="candle-body-layout">
        <p className="candle-intro-text">{t('candle_intro')}</p>
        
        <div className="candle-container">
          <div className={`candle-wick ${isLit ? 'candle-wick--lit' : ''}`}></div>
          {isLit && (
            <div className="flame-wrapper">
              <div className="flame-core"></div>
              <div className="flame-glow"></div>
            </div>
          )}
          <div className="candle-wax"></div>
          <div className="candle-stand"></div>
        </div>

        <div className="candle-stats-wrapper">
          <span className="candle-count-value">{count.toLocaleString()}</span>
          <span className="candle-count-label">{t('lit_candles')}</span>
        </div>

        <Button 
          onClick={handleLightCandle} 
          disabled={isLit || loading} 
          variant={isLit ? 'outline' : 'primary'}
          className={`light-candle-btn ${isLit ? 'light-candle-btn--active' : ''}`}
        >
          {loading ? '...' : isLit ? '✓ ' + t('living') : t('light_candle')}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CandleSection;
