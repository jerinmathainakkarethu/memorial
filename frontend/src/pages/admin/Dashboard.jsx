import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchDashboardStats } from '../../utils/api'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import '../../styles/Dashboard.css'

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
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-card__value">{stats.total_families}</div>
            <div className="stat-card__label">Families</div>
          </Card.Body>
        </Card>
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-card__value">{stats.total_members}</div>
            <div className="stat-card__label">Members</div>
          </Card.Body>
        </Card>
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-card__value">{stats.total_photos}</div>
            <div className="stat-card__label">Photos</div>
          </Card.Body>
        </Card>
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-card__value">{stats.total_messages}</div>
            <div className="stat-card__label">Messages</div>
          </Card.Body>
        </Card>
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-card__value">{stats.pending_messages}</div>
            <div className="stat-card__label">Pending</div>
          </Card.Body>
        </Card>
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-card__value">{stats.total_qr_scans.toLocaleString()}</div>
            <div className="stat-card__label">QR Scans</div>
          </Card.Body>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card>
          <Card.Header>Recent Members</Card.Header>
          <Card.Body>
            <div className="recent-list">
              {stats.recentMembers.map((m) => (
                <Link to={`/member/${m.slug}`} key={m.id} className="recent-item">
                  <div className="recent-item__avatar">{m.full_name.charAt(0)}</div>
                  <div className="recent-item__info">
                    <span className="recent-item__name">{m.full_name}</span>
                    <span className="recent-item__detail">{m.occupation}</span>
                  </div>
                  {m.is_deceased ? <Badge variant="danger">Deceased</Badge> : <Badge variant="success">Living</Badge>}
                </Link>
              ))}
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>Recent Messages</Card.Header>
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
