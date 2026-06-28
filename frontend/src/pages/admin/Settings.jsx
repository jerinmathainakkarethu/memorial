import { useState, useEffect } from 'react'
import { fetchSettings, updateSettings } from '../../utils/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import '../../styles/AdminTable.css'
import '../../styles/AdminSettings.css'

const SETTINGS_DEFS = [
  {
    key: 'site_name',
    label: 'Site Name',
    labelMl: 'സൈറ്റ് പേര്',
    type: 'text',
    description: 'The name displayed on the public website header and title.',
    descriptionMl: 'പൊതു വെബ്‌സൈറ്റ് ഹെഡറിലും ശീർഷകത്തിലും പ്രദർശിപ്പിച്ചിരിക്കുന്ന പേര്.',
    icon: '🏛️',
  },
  {
    key: 'hide_living',
    label: 'Living Member Visibility',
    labelMl: 'ജീവിച്ചിരിക്കുന്ന അംഗങ്ങളുടെ ദൃശ്യത',
    type: 'toggle',
    description: 'Hide living family members from the public family tree.',
    descriptionMl: 'പൊതു കുടുംബ വൃക്ഷത്തിൽ ജീവിച്ചിരിക്കുന്ന കുടുംബാംഗങ്ങളെ മറയ്ക്കുക.',
    icon: '👁️',
  },
  {
    key: 'allow_public_messages',
    label: 'Public Messages',
    labelMl: 'പൊതു സന്ദേശങ്ങൾ',
    type: 'toggle',
    description: 'Allow visitors to submit memorial messages for deceased members.',
    descriptionMl: 'സന്ദർശകർക്ക് വിട്ടുപോയ അംഗങ്ങൾക്ക് സ്മരണാർത്ഥം സന്ദേശങ്ങൾ സമർപ്പിക്കാൻ അനുവദിക്കുക.',
    icon: '💬',
  },
  {
    key: 'auto_approve_messages',
    label: 'Auto-approve Messages',
    labelMl: 'സന്ദേശങ്ങൾ യാന്ത്രികമായി അംഗീകരിക്കുക',
    type: 'toggle',
    description: 'New memorial messages are automatically approved without admin review.',
    descriptionMl: 'പുതിയ സ്മരണാർത്ഥ സന്ദേശങ്ങൾ അഡ്മിൻ അവലോകനമില്ലാതെ യാന്ത്രികമായി അംഗീകരിക്കും.',
    icon: '✅',
  },
  {
    key: 'allow_candles',
    label: 'Virtual Candles',
    labelMl: 'വെർച്വൽ മെഴുകുതിരികൾ',
    type: 'toggle',
    description: 'Allow visitors to light virtual candles in memory of deceased members.',
    descriptionMl: 'സന്ദർശകർക്ക് വിട്ടുപോയ അംഗങ്ങളുടെ സ്മരണയ്ക്കായി വെർച്വൽ മെഴുകുതിരികൾ തെളിക്കാൻ അനുവദിക്കുക.',
    icon: '🕯️',
  },
]

const DEFAULT_VALUES = {
  site_name: 'Family Memorial',
  hide_living: '0',
  allow_public_messages: '1',
  auto_approve_messages: '0',
  allow_candles: '1',
}

function AdminSettings() {
  const [settings, setSettings] = useState({ ...DEFAULT_VALUES })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings()
        setSettings((prev) => ({ ...prev, ...data }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
    setSuccess('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateSettings(settings)
      setSuccess('Settings saved successfully.')
      setDirty(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="admin-settings">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="settings-sections">
          {SETTINGS_DEFS.map((def) => (
            <Card key={def.key} className="setting-card">
              <div className="setting-card__icon">{def.icon}</div>
              <div className="setting-card__body">
                <div className="setting-card__label">{def.label}</div>
                <div className="setting-card__label setting-card__label--ml">{def.labelMl}</div>
                <p className="setting-card__desc">{def.description}</p>
                <p className="setting-card__desc setting-card__desc--ml">{def.descriptionMl}</p>
              </div>
              <div className="setting-card__control">
                {def.type === 'toggle' ? (
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings[def.key] === '1'}
                      onChange={(e) => handleChange(def.key, e.target.checked ? '1' : '0')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                ) : (
                  <input
                    type="text"
                    className="setting-text-input"
                    value={settings[def.key] || ''}
                    onChange={(e) => handleChange(def.key, e.target.value)}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="settings-footer">
          <div className="settings-status">
            {error && <div className="settings-msg settings-msg--error">{error}</div>}
            {success && <div className="settings-msg settings-msg--success">{success}</div>}
          </div>
          {dirty && (
            <div className="settings-unsaved">You have unsaved changes</div>
          )}
          <Button type="submit" disabled={saving || !dirty} size="lg">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings
