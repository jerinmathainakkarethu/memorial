import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchFamilyBySlug, getMediaUrl } from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';
import FamilyTree from '../../components/FamilyTree/FamilyTree';
import MemberDetail from './MemberDetail';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/FamilyDetail.css';

function FamilyDetail() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightSlug = searchParams.get('highlight');

  const { language, setLanguage, t, getField } = useLanguage();
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  // Drawer slide-over state
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchFamilyBySlug(slug)
      .then((data) => {
        setFamily(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  // Sync highlighted member from URL query parameter
  useEffect(() => {
    if (family && highlightSlug) {
      const member = family.members.find((m) => m.slug === highlightSlug);
      if (member) {
        setSelectedMember(member);
      }
    }
  }, [family, highlightSlug]);

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setSearchParams({ highlight: member.slug });
  };

  const handleCloseDrawer = () => {
    setSelectedMember(null);
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!family) {
    return (
      <div className="detail-loading">
        <p>{t('not_found')}</p>
      </div>
    );
  }

  const deceased = family.members.filter((m) => m.is_deceased);
  const alive = family.members.filter((m) => !m.is_deceased);
  const hideLiving = family.settings?.hide_living === '1' || family.settings?.hide_living === 1 || family.settings?.hide_living === true;

  const memberById = new Map(family.members.map((m) => [m.id, m]));
  const treeMembers = hideLiving ? family.members.filter((m) => m.is_deceased) : family.members;
  const treeRelationships = hideLiving
    ? (family.relationships || []).filter((r) => {
        const member = memberById.get(r.member_id);
        const related = memberById.get(r.related_member_id);
        return member?.is_deceased && related?.is_deceased;
      })
    : family.relationships || [];

  const hasParent = new Set();
  family.relationships?.forEach((r) => {
    if (r.relationship_type === 'father' || r.relationship_type === 'mother') {
      hasParent.add(r.related_member_id);
    }
  });

  return (
    <div className="family-detail">
      {/* Header and Language toggle */}
      <div className="family-detail__header">
        <div
          className="family-detail__cover"
          style={family.cover_photo ? { backgroundImage: `url(${getMediaUrl(family.cover_photo)})` } : undefined}
        >
          {!family.cover_photo && (
            <div className="family-detail__avatar-large">
              {getField(family, 'name').charAt(0)}
            </div>
          )}
        </div>
        <div className="family-detail__info">
          <div className="family-header-row">
            <h1 className="family-detail__name">{getField(family, 'name')}</h1>
          </div>
          {family.motto && (
            <p className="family-detail__motto">
              &ldquo;{getField(family, 'motto')}&rdquo;
            </p>
          )}
          <p className="family-detail__desc">{getField(family, 'description')}</p>
          <div className="family-detail__stats">
            <span>{family.members.length} {t('members_count')}</span>
            <span>{alive.length} {t('living_count')}</span>
            <span>{deceased.length} {t('departed_count')}</span>
          </div>
        </div>
      </div>

      {/* Interactive Family Tree Section */}
      <section className="tree-section">
        <h2 className="section-title">{t('tree')}</h2>
        <FamilyTree 
          members={treeMembers}
          relationships={treeRelationships}
          highlightSlug={highlightSlug}
          onSelectMember={handleSelectMember}
        />
      </section>

      {/* Slide-over Profile Drawer */}
      <div className={`profile-drawer ${selectedMember ? 'profile-drawer--open' : ''}`}>
        <div className="profile-drawer__backdrop" onClick={handleCloseDrawer}></div>
        <div className="profile-drawer__content">
          <button className="profile-drawer__close-btn" onClick={handleCloseDrawer}>
            ✕ {t('close')}
          </button>
          {selectedMember && (
            <div className="profile-drawer__body">
              <MemberDetail slug={selectedMember.slug} isDrawer={true} />
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Family Lists */}
      <section className="member-section">
        <h2 className="section-title">{t('deceased')}</h2>
        <div className="member-grid">
          {deceased.map((member) => (
            <div 
              key={member.id} 
              className="member-card-link"
              onClick={() => handleSelectMember(member)}
              style={{ cursor: 'pointer' }}
            >
              <Card className="member-card member-card--deceased-border">
                <div className="member-card__photo">
                  <Avatar name={member.full_name} size="lg" />
                </div>
                <Card.Body>
                  <h3 className="member-card__name">{getField(member, 'full_name')}</h3>
                  {member.nickname && (
                    <p className="member-card__nickname">
                      &ldquo;{getField(member, 'nickname')}&rdquo;
                    </p>
                  )}
                  <p className="member-card__lifespan">
                    {member.date_of_birth ? new Date(member.date_of_birth).getFullYear() : ''} – {member.date_of_death ? new Date(member.date_of_death).getFullYear() : ''}
                  </p>
                  <p className="member-card__occupation">{getField(member, 'occupation')}</p>
                  <Badge variant="danger">{t('deceased')}</Badge>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {!hideLiving && (
        <section className="member-section">
          <h2 className="section-title">{t('living')}</h2>
          <div className="member-grid">
            {alive.map((member) => (
              <div 
                key={member.id} 
                className="member-card-link"
                onClick={() => handleSelectMember(member)}
                style={{ cursor: 'pointer' }}
              >
                <Card className="member-card">
                  <div className="member-card__photo">
                    <Avatar name={member.full_name} size="lg" />
                  </div>
                  <Card.Body>
                    <h3 className="member-card__name">{getField(member, 'full_name')}</h3>
                    {member.nickname && (
                      <p className="member-card__nickname">
                        &ldquo;{getField(member, 'nickname')}&rdquo;
                      </p>
                    )}
                    <p className="member-card__lifespan">
                      {t('born')}: {member.date_of_birth ? new Date(member.date_of_birth).getFullYear() : ''}
                    </p>
                    <p className="member-card__occupation">{getField(member, 'occupation')}</p>
                    <Badge variant="success">{t('living')}</Badge>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default FamilyDetail;
