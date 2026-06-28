import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchDashboardStats } from '../../utils/api'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import '../../styles/Dashboard.css'

const STAT_CARDS = [
  { key: 'total_families', label: 'Families', icon: '🏛️', gradient: 'linear-gradient(135deg, #818cf8, #a78bfa)' },
  { key: 'total_members', label: 'Members', icon: '👤', gradient: 'linear-gradient(135deg, #60a5fa, #22d3ee)' },
  { key: 'total_photos', label: 'Photos', icon: '📸', gradient: 'linear-gradient(135deg, #34d399, #6ee7b7)' },
  { key: 'total_messages', label: 'Messages', icon: '💬', gradient: 'linear-gradient(135deg, #fbbf24, #fb923c)' },
  { key: 'pending_messages', label: 'Pending', icon: '⏳', gradient: 'linear-gradient(135deg, #fb7185, #f43f5e)' },
  { key: 'total_qr_scans', label: 'QR Scans', icon: '📱', gradient: 'linear-gradient(135deg, #c084fc, #e879f9)' },
]

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats().then((data) => {
      setStats(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your family memorial site</p>
      </div>

      <div className="stats-grid">
        {STAT_CARDS.map((c) => (
          <Card key={c.key} className="stat-card" style={{ background: c.gradient }}>
            <Card.Body>
              <div className="stat-card__icon">{c.icon}</div>
              <div className="stat-card__value">{c.key === 'total_qr_scans' ? (stats[c.key] || 0).toLocaleString() : stats[c.key] || 0}</div>
              <div className="stat-card__label">{c.label}</div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="dashboard-grid">
        <Card className="recent-card">
          <Card.Header>
            <span className="recent-card__title">👥 Recent Members</span>
          </Card.Header>
          <Card.Body>
            <div className="recent-list">
              {stats.recentMembers.map((m) => (
                <Link to={'/member/' + m.slug} key={m.id} className="recent-item">
                  <div className={'recent-item__avatar' + (m.is_deceased ? ' recent-item__avatar--deceased' : ' recent-item__avatar--living')}>
                    {m.full_name.charAt(0)}
                  </div>
                  <div className="recent-item__info">
                    <span className="recent-item__name">{m.full_name}</span>
                    <span className="recent-item__detail">{m.occupation || '—'}</span>
                  </div>
                  {m.is_deceased ? <Badge variant="danger">Deceased</Badge> : <Badge variant="success">Living</Badge>}
                </Link>
              ))}
            </div>
          </Card.Body>
        </Card>

        <Card className="recent-card">
          <Card.Header>
            <span className="recent-card__title">💬 Recent Messages</span>
          </Card.Header>
          <Card.Body>
            <div className="recent-list">
              {stats.recentMessages.map((m) => (
                <div key={m.id} className="recent-item">
                  <div className="recent-item__avatar recent-item__avatar--msg">{m.visitor_name.charAt(0)}</div>
                  <div className="recent-item__info">
                    <span className="recent-item__name">{m.visitor_name}</span>
                    <span className="recent-item__detail">{m.message.slice(0, 60)}...</span>
                  </div>
                  {m.is_approved ? <Badge variant="success">Approved</Badge> : <Badge variant="warning">Pending</Badge>}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
