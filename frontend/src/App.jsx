import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Home from './pages/public/Home'
import FamilyDetail from './pages/public/FamilyDetail'
import MemberDetail from './pages/public/MemberDetail'
import QrRedirect from './pages/public/QrRedirect'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminFamilies from './pages/admin/Families'
import AdminMembers from './pages/admin/Members'
import AdminMessages from './pages/admin/Messages'
import AdminMedia from './pages/admin/Media'
import AdminTimeline from './pages/admin/Timeline'
import AdminSettings from './pages/admin/Settings'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return children
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/family/:slug" element={<FamilyDetail />} />
        <Route path="/member/:slug" element={<MemberDetail />} />
        <Route path="/m/:slug" element={<QrRedirect />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/families" element={<ProtectedRoute><AdminFamilies /></ProtectedRoute>} />
        <Route path="/admin/members" element={<ProtectedRoute><AdminMembers /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
        <Route path="/admin/media" element={<ProtectedRoute><AdminMedia /></ProtectedRoute>} />
        <Route path="/admin/timeline" element={<ProtectedRoute><AdminTimeline /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}

export default App
