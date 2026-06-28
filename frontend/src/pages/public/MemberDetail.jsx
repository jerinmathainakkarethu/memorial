import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMemberBySlug, fetchPublicSettings, submitMessage, getMediaUrl } from '../../utils/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CandleSection from '../../components/Memorial/CandleSection';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/MemberDetail.css';

// SVG Icon Helper for Timeline events
function getEventIcon(type) {
  const goldColor = '#D4AF37';
  switch (type) {
    case 'birth':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'education':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    case 'marriage':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2">
          <circle cx="9" cy="12" r="6" />
          <circle cx="15" cy="12" r="6" />
        </svg>
      );
    case 'career':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'award':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
          <path d="M12 2a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
        </svg>
      );
    case 'retirement':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case 'death':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2">
          <path d="M12 2v20M5 7h14" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
  }
}

function MemberDetail({ slug: propSlug, isDrawer = false }) {
  const routerParams = useParams();
  const slug = propSlug || routerParams.slug;

  const { t, getField } = useLanguage();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ visitor_name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState({});

  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMemberBySlug(slug)
      .then((data) => {
        setMember(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    fetchPublicSettings()
      .then((data) => setSettings(data || {}))
      .catch(() => {});
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.visitor_name || !form.message) return;
    try {
      await submitMessage(member.id, form);
      setSubmitted(true);
      setForm({ visitor_name: '', message: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="detail-loading">
        <p>{t('not_found')}</p>
      </div>
    );
  }

  // Combine local videos and YouTube videos
  const videosList = member.videos || [];

  return (
    <div className={`member-detail ${isDrawer ? 'member-detail--drawer' : ''}`}>
      {/* Redundant headers hidden in drawer mode */}
      {!isDrawer && (
        <div className="member-detail__breadcrumb">
          <Link to="/">{t('home')}</Link>
          <span>/</span>
          <Link to={`/family/${member.family_slug}`}>{getField(member, 'family_name')}</Link>
          <span>/</span>
          <span>{getField(member, 'full_name')}</span>
        </div>
      )}

      {/* Member Hero Header */}
      <div className="member-detail__header">
        <div className="member-detail__photo">
          <Avatar 
            name={member.full_name} 
            src={member.profile_photo ? getMediaUrl(member.profile_photo) : null} 
            size="lg" 
          />
        </div>
        <div className="member-detail__info">
          <h1 className="member-detail__name">
            {getField(member, 'full_name')}
            {member.nickname && (
              <span className="member-detail__nickname"> &ldquo;{getField(member, 'nickname')}&rdquo;</span>
            )}
          </h1>
          <div className="member-detail__meta">
            {member.is_deceased ? (
              <Badge variant="danger">{t('deceased')}</Badge>
            ) : (
              <Badge variant="success">{t('living')}</Badge>
            )}
            <span>{member.gender === 'male' ? 'Male' : member.gender === 'female' ? 'Female' : 'Other'}</span>
            {member.date_of_birth && (
              <span>{t('born')}: {new Date(member.date_of_birth).toLocaleDateString()}</span>
            )}
            {member.date_of_death && (
              <span>{t('died')}: {new Date(member.date_of_death).toLocaleDateString()}</span>
            )}
          </div>
          <p className="member-detail__occupation">{getField(member, 'occupation')}</p>
        </div>
      </div>

      <div className="member-detail__grid">
        <div className="member-detail__main">
          {/* Biography */}
          {getField(member, 'biography') && (
            <Card className="detail-section">
              <Card.Header className="gold-title">{t('biography')}</Card.Header>
              <Card.Body>
                <p className="member-detail__bio">{getField(member, 'biography')}</p>
              </Card.Body>
            </Card>
          )}

          {/* Timeline of Life */}
          {member.timeline && member.timeline.length > 0 && (
            <Card className="detail-section">
              <Card.Header className="gold-title">{t('timeline')}</Card.Header>
              <Card.Body>
                <div className="timeline">
                  {member.timeline.map((event) => (
                    <div key={event.id} className="timeline__item">
                      <div className="timeline__icon-badge">
                        {getEventIcon(event.event_type)}
                      </div>
                      <div className="timeline__content">
                        <span className="timeline__date">
                          {event.event_date ? new Date(event.event_date).getFullYear() : event.event_year}
                        </span>
                        <h4 className="timeline__title">{getField(event, 'title')}</h4>
                        {getField(event, 'description') && (
                          <p className="timeline__desc">{getField(event, 'description')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Audio voice memories */}
          {member.audioClips && member.audioClips.length > 0 && (
            <Card className="detail-section">
              <Card.Header className="gold-title">{t('audio_memories')}</Card.Header>
              <Card.Body>
                <div className="audio-clips-list">
                  {member.audioClips.map((clip) => (
                    <div key={clip.id} className="audio-clip-item">
                      <div className="audio-clip-item__meta">
                        <strong className="audio-title">{clip.title}</strong>
                        {clip.description && <p className="audio-desc">{clip.description}</p>}
                      </div>
                      <audio controls src={getMediaUrl(clip.file_path)} className="custom-audio-player"></audio>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Photos Grid */}
          {member.photos && member.photos.length > 0 && (
            <Card className="detail-section">
              <Card.Header className="gold-title">{t('gallery')}</Card.Header>
              <Card.Body>
                <div className="gallery-masonry">
                  {member.photos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="gallery-item-wrapper"
                      onClick={() => setLightboxImage(photo)}
                      title={photo.caption || ''}
                    >
                      <img 
                        src={getMediaUrl(photo.file_path)} 
                        alt={photo.alt_text || 'Photo'} 
                        className="gallery-img-thumb" 
                        loading="lazy"
                      />
                      {photo.caption && <span className="gallery-item__caption">{photo.caption}</span>}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Videos Section */}
          {videosList.length > 0 && (
            <Card className="detail-section">
              <Card.Header className="gold-title">{t('videos')}</Card.Header>
              <Card.Body>
                <div className="videos-list">
                  {videosList.map((video) => (
                    <div key={video.id} className="video-card-item">
                      <h4 className="video-title">{video.title}</h4>
                      {video.description && <p className="video-desc">{video.description}</p>}
                      <div className="video-player-container">
                        {video.video_type === 'youtube' ? (
                          <iframe
                            width="100%"
                            height="300"
                            src={`https://www.youtube.com/embed/${video.youtube_id}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="youtube-iframe"
                          ></iframe>
                        ) : (
                          <video 
                            controls 
                            src={getMediaUrl(video.file_path)} 
                            className="local-video-element"
                            preload="metadata"
                          ></video>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Lightbox Modal overlay */}
          {lightboxImage && (
            <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
              <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox-close" onClick={() => setLightboxImage(null)}>✕</button>
                <img src={getMediaUrl(lightboxImage.file_path)} alt="Lightbox view" className="lightbox-img" />
                {lightboxImage.caption && <p className="lightbox-caption">{lightboxImage.caption}</p>}
              </div>
            </div>
          )}

          {/* Memorial Messages Wall */}
          <Card className="detail-section">
            <Card.Header className="gold-title">{t('messages')}</Card.Header>
            <Card.Body>
              {member.messages && member.messages.length > 0 ? (
                <div className="messages-list" style={{ marginBottom: '1.5rem' }}>
                  {member.messages.map((msg, idx) => (
                    <div key={idx} className="message-item">
                      <div className="message-item__header">
                        <strong className="msg-visitor">{msg.visitor_name}</strong>
                        <span className="message-item__date">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="message-item__text">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {settings.allow_public_messages !== '0' && (
                submitted ? (
                  <p className="thank-you">
                    {settings.auto_approve_messages === '1'
                      ? 'Thank you for your tribute.'
                      : t('tribute_approval_notice')}
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} className="message-form">
                    <h4 style={{ color: '#0F172A', marginBottom: '8px', fontSize: '0.9375rem' }}>{t('leave_message')}</h4>
                    <input
                      type="text"
                      placeholder={t('your_name')}
                      value={form.visitor_name}
                      onChange={(e) => setForm({ ...form, visitor_name: e.target.value })}
                      required
                      className="form-input"
                    />
                    <textarea
                      placeholder={t('your_message')}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={4}
                      className="form-textarea"
                    />
                    <Button type="submit">{t('submit_message')}</Button>
                  </form>
                )
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="member-detail__side">
          {/* Candle Lighting section */}
          {member.is_deceased === 1 && settings.allow_candles !== '0' && (
            <CandleSection memberId={member.id} initialCount={member.candle_count} />
          )}

          {/* Grave Location Maps Section */}
          {member.is_deceased === 1 && member.graveLocation && (
            <Card className="detail-section location-card">
              <Card.Header className="gold-title">{t('grave_location')}</Card.Header>
              <Card.Body>
                <div className="location-details">
                  <div className="location-icon">📍</div>
                  <div className="location-text">
                    {member.graveLocation.cemetery_name && (
                      <p><strong>{t('cemetery')}:</strong> {member.graveLocation.cemetery_name}</p>
                    )}
                    {member.graveLocation.plot_number && (
                      <p><strong>{t('plot')}:</strong> {member.graveLocation.plot_number}</p>
                    )}
                    {member.graveLocation.section && (
                      <p><strong>{t('section')}:</strong> {member.graveLocation.section}</p>
                    )}
                    {member.graveLocation.address && (
                      <p>{member.graveLocation.address}</p>
                    )}
                  </div>
                </div>
                {member.graveLocation.latitude && member.graveLocation.longitude && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${member.graveLocation.latitude},${member.graveLocation.longitude}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="maps-nav-link"
                  >
                    {t('navigate_maps')} →
                  </a>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Details list */}
          <Card className="detail-section">
            <Card.Header className="gold-title">{t('details')}</Card.Header>
            <Card.Body>
              <dl className="detail-list">
                {member.place_of_birth && (
                  <>
                    <dt>{t('place_of_birth')}</dt>
                    <dd>{member.place_of_birth}</dd>
                  </>
                )}
                {member.place_of_death && (
                  <>
                    <dt>{t('place_of_death')}</dt>
                    <dd>{member.place_of_death}</dd>
                  </>
                )}
                {member.occupation && (
                  <>
                    <dt>{t('occupation')}</dt>
                    <dd>{getField(member, 'occupation')}</dd>
                  </>
                )}
                {member.education && (
                  <>
                    <dt>{t('education')}</dt>
                    <dd>{getField(member, 'education')}</dd>
                  </>
                )}
                {member.awards && (
                  <>
                    <dt>{t('awards')}</dt>
                    <dd>{getField(member, 'awards')}</dd>
                  </>
                )}
                {member.hobbies && (
                  <>
                    <dt>{t('hobbies')}</dt>
                    <dd>{getField(member, 'hobbies')}</dd>
                  </>
                )}
                {member.religion && (
                  <>
                    <dt>{t('religion')}</dt>
                    <dd>{getField(member, 'religion')}</dd>
                  </>
                )}
              </dl>
            </Card.Body>
          </Card>

          {/* Family relationships links */}
          {member.relatedMembers && member.relatedMembers.length > 0 && (
            <Card className="detail-section">
              <Card.Header className="gold-title">{t('relationships')}</Card.Header>
              <Card.Body>
                <div className="related-list">
                  {member.relatedMembers.map((rel) => {
                    const relType = rel.relationship_type;
                    const relLabel = relType ? t(relType) || relType : '';
                    const birthYear = rel.related_dob ? new Date(rel.related_dob).getFullYear() : null;
                    const deathYear = rel.related_dod ? new Date(rel.related_dod).getFullYear() : null;
                    const lifeSpan = birthYear || deathYear ? `${birthYear || ''}${deathYear ? ` – ${deathYear}` : ''}` : '';
                    const statusLabel = rel.related_dod ? t('deceased') : t('living');

                    return (
                      <Link key={rel.id} to={`/member/${rel.slug}`} className="related-item">
                        <Avatar name={rel.full_name} src={rel.profile_photo ? getMediaUrl(rel.profile_photo) : null} size="sm" />
                        <div className="related-item__info">
                          <span className="related-item__name">{rel.full_name}</span>
                          <span className="related-item__relation">{relLabel}</span>
                          {lifeSpan && <span className="related-item__detail">{lifeSpan}</span>}
                          <span className="related-item__detail">{statusLabel}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberDetail;
