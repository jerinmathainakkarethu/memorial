import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { fetchPublicSettings } from '../../utils/api'
import '../../styles/Layout.css'

function Layout({ children }) {
  const [siteName, setSiteName] = useState('Family Memorial')
  const { isAuthenticated, user, logout } = useAuth()
  const { language, setLanguage } = useLanguage()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    if (!isAdmin) {
      fetchPublicSettings()
        .then((data) => {
          if (data.site_name) setSiteName(data.site_name)
        })
        .catch(() => {})
    }
  }, [isAdmin])

  if (isAdmin && !isAuthenticated) {
    return (
      <div className="admin-login-layout">
        {children}
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="admin-layout">
        <aside className="sidebar">
          <div className="sidebar__brand">
            <Link to="/admin">Admin Panel</Link>
          </div>
          <nav className="sidebar__nav">
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Dashboard</Link>
            <Link to="/admin/families" className={location.pathname.startsWith('/admin/families') ? 'active' : ''}>Families</Link>
            <Link to="/admin/members" className={location.pathname.startsWith('/admin/members') ? 'active' : ''}>Members</Link>
            <Link to="/admin/media" className={location.pathname.startsWith('/admin/media') ? 'active' : ''}>Media</Link>
            <Link to="/admin/messages" className={location.pathname.startsWith('/admin/messages') ? 'active' : ''}>Messages</Link>
            <Link to="/admin/timeline" className={location.pathname.startsWith('/admin/timeline') ? 'active' : ''}>Timeline</Link>
            <Link to="/admin/settings" className={location.pathname.startsWith('/admin/settings') ? 'active' : ''}>Settings</Link>
            <Link to="/admin/users" className={location.pathname.startsWith('/admin/users') ? 'active' : ''}>Users</Link>
          </nav>
          <div className="sidebar__footer">
            <Link to="/" className="sidebar__back">← Back to Site</Link>
            {isAuthenticated && (
              <button onClick={logout} className="sidebar__logout">Logout</button>
            )}
          </div>
        </aside>
        <main className="admin-content">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="public-header__inner">
          <Link to="/" className="public-header__logo">{siteName}</Link>
          <div className="public-header__actions">
            <nav className="public-header__nav">
              <Link to="/">Home</Link>
              <Link to="/admin">Admin</Link>
            </nav>
            <button
              className="lang-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>
          </div>
        </div>
      </header>
      <main className="public-main">{children}</main>
      <footer className="public-footer">
        <div className="public-footer__inner">
          <p>&copy; {new Date().getFullYear()} Anna Ann Mathew Thattakunnel. Preserving our stories for generations.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
