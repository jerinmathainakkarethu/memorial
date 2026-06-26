import { useState, useEffect } from 'react'
import { fetchSettings, updateSetting } from '../../utils/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import '../../styles/AdminTable.css'

function AdminSettings() {
  const [settings, setSettings] = useState({ hide_living: '0' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings()
        setSettings((prev) => ({ ...prev, ...data }))
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await updateSetting('hide_living', settings.hide_living)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="admin-settings">
      <div className="page-header">
        <h1 className="page-title">Admin Settings</h1>
      </div>

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <div className="form-group">
            <label className="form-label">Living member visibility</label>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  name="hide_living"
                  value="1"
                  checked={settings.hide_living === '1'}
                  onChange={(e) => setSettings((prev) => ({ ...prev, hide_living: e.target.value }))}
                />
                Hide living members
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  name="hide_living"
                  value="0"
                  checked={settings.hide_living === '0'}
                  onChange={(e) => setSettings((prev) => ({ ...prev, hide_living: e.target.value }))}
                />
                Show living members
              </label>
            </div>
          </div>

          <div className="admin-settings__note">
            <p>
              This setting controls whether living family members are hidden on the public family tree.
              Only administrators can update this value.
            </p>
          </div>

          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Setting'}</Button>
        </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminSettings
