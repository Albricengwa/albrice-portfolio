import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Save, Plus, Trash2, User, Briefcase, Code2, FolderOpen,
  GraduationCap, Award, Settings, Wrench, Lock, Eye, EyeOff, RefreshCw,
  Upload, Check, X,
} from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

/* ----------------------------------------------------------------
   Admin Panel — PIN-gated dashboard for editing all portfolio data
---------------------------------------------------------------- */
export default function Admin() {
  const { data, updateProfile, addItem, updateItem, removeItem, resetAll, updatePin } = usePortfolio()
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 1500) }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="bg-white border border-divider rounded-4xl p-8 sm:p-12 max-w-md w-full shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-ink">Admin Portal</h1>
              <p className="text-muted text-sm">Enter your PIN to access</p>
            </div>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault()
            if (pin === data.adminPin) { setAuthed(true); setPinError(false) }
            else { setPinError(true); setPin('') }
          }}>
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false) }}
              placeholder="Enter PIN"
              className={`w-full bg-background border ${pinError ? 'border-red-400' : 'border-divider'} rounded-2xl px-4 py-3.5 text-ink text-center text-2xl tracking-[0.5em] font-mono focus:border-accent focus:ring-4 focus:ring-accent/15 outline-none transition`}
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm mt-2 text-center">Incorrect PIN. Try again.</p>}
            <button type="submit" className="mt-6 w-full bg-accent text-white font-semibold py-3.5 rounded-full shadow-lg shadow-accent/30 hover:shadow-xl transition">
              Unlock
            </button>
          </form>
          <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-muted text-sm hover:text-accent transition">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Link>
          {/* PIN hint removed for security */}
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', Icon: User },
    { id: 'skills', label: 'Skills', Icon: Code2 },
    { id: 'experience', label: 'Experience', Icon: Briefcase },
    { id: 'projects', label: 'Projects', Icon: FolderOpen },
    { id: 'education', label: 'Education', Icon: GraduationCap },
    { id: 'certifications', label: 'Certs', Icon: Award },
    { id: 'services', label: 'Services', Icon: Wrench },
    { id: 'settings', label: 'Settings', Icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Saved toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="h-4 w-4" /> Saved!
        </div>
      )}

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-16 sm:w-56 bg-deep text-white min-h-screen p-3 sm:p-4 flex flex-col shrink-0 sticky top-0">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-sm text-white">A</span>
            </div>
            <span className="font-display font-bold text-sm hidden sm:block">Admin Portal</span>
          </Link>

          <nav className="flex flex-col gap-1 flex-1">
            {tabs.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? 'bg-accent text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </nav>

          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-accent text-sm mt-4 px-3 py-2 transition">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:block">View Site</span>
          </Link>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 sm:p-10 max-w-4xl">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-8 flex items-center gap-3">
            {tabs.find((t) => t.id === tab)?.Icon && (() => { const I = tabs.find((t) => t.id === tab).Icon; return <I className="h-6 w-6 text-accent" /> })()}
            {tabs.find((t) => t.id === tab)?.label}
          </h1>

          {tab === 'profile' && <ProfileEditor flash={flash} />}
          {tab === 'skills' && <ListEditor section="skills" fields={skillFields} flash={flash} />}
          {tab === 'experience' && <ListEditor section="experience" fields={experienceFields} flash={flash} />}
          {tab === 'projects' && <ListEditor section="projects" fields={projectFields} flash={flash} />}
          {tab === 'education' && <ListEditor section="education" fields={educationFields} flash={flash} />}
          {tab === 'certifications' && <ListEditor section="certifications" fields={certFields} flash={flash} />}
          {tab === 'services' && <ListEditor section="services" fields={serviceFields} flash={flash} />}
          {tab === 'settings' && <SettingsEditor flash={flash} />}
        </main>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
   PROFILE EDITOR
---------------------------------------------------------------- */
function ProfileEditor({ flash }) {
  const { data, updateProfile } = usePortfolio()
  const [form, setForm] = useState({ ...data.profile })
  const [photoError, setPhotoError] = useState('')
  const fileInputRef = useRef(null)

  const save = () => { updateProfile(form); flash() }
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  // Reads the chosen file, downscales it on a local <canvas>, and stores it
  // as a base64 data URL — the photo never leaves this device or touches
  // any external server.
  const handlePhotoFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setPhotoError('Please choose an image file.'); return }
    setPhotoError('')
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 800
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        set('photoUrl', canvas.toDataURL('image/jpeg', 0.88))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-divider rounded-3xl p-6 sm:p-8">
        <h3 className="font-display font-semibold text-lg mb-6 text-ink">Personal Information</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminField label="Full Name" value={form.name} onChange={(v) => set('name', v)} />
          <AdminField label="Title" value={form.title} onChange={(v) => set('title', v)} />
          <AdminField label="Subtitle" value={form.subtitle} onChange={(v) => set('subtitle', v)} />
          <AdminField label="Location" value={form.location} onChange={(v) => set('location', v)} />
          <AdminField label="Email" type="email" value={form.email} onChange={(v) => set('email', v)} />
          <AdminField label="Phone" type="tel" value={form.phone} onChange={(v) => set('phone', v)} />
          <AdminField label="LinkedIn URL" value={form.linkedin} onChange={(v) => set('linkedin', v)} />
          <AdminField label="GitHub URL" value={form.github} onChange={(v) => set('github', v)} />
        </div>
      </div>

      <div className="bg-white border border-divider rounded-3xl p-6 sm:p-8">
        <h3 className="font-display font-semibold text-lg mb-4 text-ink">Professional Summary</h3>
        <textarea value={form.summary} onChange={(e) => set('summary', e.target.value)} rows={4} className="w-full bg-background border border-divider rounded-2xl px-4 py-3 text-ink focus:border-accent focus:ring-4 focus:ring-accent/15 outline-none transition resize-none font-body text-sm" />
      </div>

      <div className="bg-white border border-divider rounded-3xl p-6 sm:p-8">
        <h3 className="font-display font-semibold text-lg mb-4 text-ink">Profile Photo</h3>
        <div className="flex items-center gap-5">
          {form.photoUrl ? (
            <img src={form.photoUrl} alt="Preview" className="h-24 w-24 object-cover rounded-2xl border border-divider" />
          ) : (
            <div className="h-24 w-24 rounded-2xl bg-background border border-dashed border-divider flex items-center justify-center text-muted text-xs text-center px-2">
              No photo
            </div>
          )}
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-background border border-divider text-ink font-medium px-4 py-2.5 rounded-full text-sm hover:border-accent transition"
            >
              <Upload className="h-4 w-4" /> {form.photoUrl ? 'Replace Photo' : 'Upload Photo'}
            </button>
            {form.photoUrl && (
              <button type="button" onClick={() => set('photoUrl', '')} className="inline-flex items-center gap-2 text-red-500 text-sm font-medium hover:underline w-fit">
                <Trash2 className="h-3.5 w-3.5" /> Remove photo
              </button>
            )}
          </div>
        </div>
        {photoError && <p className="text-red-500 text-xs mt-3">{photoError}</p>}
        <p className="text-muted text-xs mt-3">Stored locally on this device only — your photo is never uploaded to any external site or server.</p>
      </div>

      <button onClick={save} className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-accent/30 hover:shadow-xl transition">
        <Save className="h-4 w-4" /> Save Profile
      </button>
    </div>
  )
}

/* ----------------------------------------------------------------
   GENERIC LIST EDITOR
---------------------------------------------------------------- */
const skillFields = [
  { key: 'category', label: 'Category Name', placeholder: 'e.g. AI & Automation' },
  { key: 'icon', label: 'Icon', placeholder: 'Brain, Code2, TrendingUp, Bot, Globe, Lightbulb, etc.' },
  { key: 'items', label: 'Skills (comma-separated)', placeholder: 'Python, Node.js, React', type: 'tags' },
]

const experienceFields = [
  { key: 'role', label: 'Job Title' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location' },
  { key: 'period', label: 'Period', placeholder: '2023 – Present' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'highlights', label: 'Highlights (comma-separated)', placeholder: 'AI integration, Leadership', type: 'tags' },
]

const projectFields = [
  { key: 'title', label: 'Project Title' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'tags', label: 'Tags (comma-separated)', placeholder: 'React, AI, Design', type: 'tags' },
  { key: 'link', label: 'Project URL', placeholder: 'https://...' },
]

const educationFields = [
  { key: 'degree', label: 'Degree / Diploma' },
  { key: 'field', label: 'Field of Study' },
  { key: 'school', label: 'School Name' },
  { key: 'location', label: 'Location' },
  { key: 'year', label: 'Year' },
]

const certFields = [
  { key: 'title', label: 'Certification Title' },
  { key: 'issuer', label: 'Issuer' },
  { key: 'year', label: 'Year' },
  { key: 'icon', label: 'Icon', placeholder: 'Award, ShieldCheck, etc.' },
]

const serviceFields = [
  { key: 'title', label: 'Service Title' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'icon', label: 'Icon', placeholder: 'Bot, Globe, Lightbulb, Megaphone, Palette, BarChart3' },
]

function ListEditor({ section, fields, flash }) {
  const { data, addItem, updateItem, removeItem } = usePortfolio()
  const items = data[section] || []
  const [editing, setEditing] = useState(null) // item id or 'new'
  const [form, setForm] = useState({})

  const startAdd = () => {
    const empty = {}
    fields.forEach((f) => {
      empty[f.key] = f.type === 'tags' ? [] : ''
    })
    setForm(empty)
    setEditing('new')
  }

  const startEdit = (item) => {
    setForm({ ...item })
    setEditing(item.id)
  }

  const save = () => {
    if (editing === 'new') {
      addItem(section, form)
    } else {
      updateItem(section, editing, form)
    }
    setEditing(null)
    setForm({})
    flash()
  }

  const del = (id) => {
    if (confirm('Remove this item?')) {
      removeItem(section, id)
      flash()
    }
  }

  return (
    <div className="space-y-4">
      {/* Existing items */}
      {items.map((item) => (
        <div key={item.id} className="bg-white border border-divider rounded-3xl p-5 flex items-start justify-between gap-4">
          {editing === item.id ? (
            <div className="flex-1 space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  {f.type === 'textarea' ? (
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1 block">{f.label}</label>
                      <textarea value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={3} className="w-full bg-background border border-divider rounded-xl px-3 py-2.5 text-sm text-ink focus:border-accent outline-none transition resize-none" />
                    </div>
                  ) : f.type === 'tags' ? (
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1 block">{f.label}</label>
                      <input
                        value={Array.isArray(form[f.key]) ? form[f.key].join(', ') : form[f.key] || ''}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                        placeholder={f.placeholder}
                        className="w-full bg-background border border-divider rounded-xl px-3 py-2.5 text-sm text-ink focus:border-accent outline-none transition"
                      />
                    </div>
                  ) : (
                    <AdminField label={f.label} value={form[f.key] || ''} onChange={(v) => setForm({ ...form, [f.key]: v })} placeholder={f.placeholder} />
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={save} className="inline-flex items-center gap-1.5 bg-accent text-white text-sm font-semibold px-4 py-2 rounded-full">
                  <Check className="h-3.5 w-3.5" /> Save
                </button>
                <button onClick={() => { setEditing(null); setForm({}) }} className="inline-flex items-center gap-1.5 bg-divider/50 text-ink text-sm font-medium px-4 py-2 rounded-full">
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-semibold text-ink truncate">{item.title || item.role || item.category || item.degree || 'Untitled'}</h4>
                <p className="text-muted text-sm truncate">{item.company || item.issuer || item.school || item.description?.slice(0, 80) || item.items?.join(', ') || ''}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(item)} className="p-2 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition">
                  <Settings className="h-4 w-4" />
                </button>
                <button onClick={() => del(item.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* New item form */}
      {editing === 'new' && (
        <div className="bg-parchment border border-accent/20 rounded-3xl p-5 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              {f.type === 'textarea' ? (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1 block">{f.label}</label>
                  <textarea value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={3} className="w-full bg-white border border-divider rounded-xl px-3 py-2.5 text-sm text-ink focus:border-accent outline-none transition resize-none" />
                </div>
              ) : f.type === 'tags' ? (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1 block">{f.label}</label>
                  <input
                    value={Array.isArray(form[f.key]) ? form[f.key].join(', ') : form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    placeholder={f.placeholder}
                    className="w-full bg-white border border-divider rounded-xl px-3 py-2.5 text-sm text-ink focus:border-accent outline-none transition"
                  />
                </div>
              ) : (
                <AdminField label={f.label} value={form[f.key] || ''} onChange={(v) => setForm({ ...form, [f.key]: v })} placeholder={f.placeholder} />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={save} className="inline-flex items-center gap-1.5 bg-accent text-white text-sm font-semibold px-4 py-2 rounded-full">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
            <button onClick={() => { setEditing(null); setForm({}) }} className="inline-flex items-center gap-1.5 bg-divider/50 text-ink text-sm font-medium px-4 py-2 rounded-full">
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>
        </div>
      )}

      {editing !== 'new' && (
        <button onClick={startAdd} className="w-full border-2 border-dashed border-divider rounded-3xl py-4 text-muted hover:border-accent/50 hover:text-accent transition flex items-center justify-center gap-2 text-sm font-medium">
          <Plus className="h-4 w-4" /> Add New
        </button>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------
   SETTINGS
---------------------------------------------------------------- */
function SettingsEditor({ flash }) {
  const { data, updatePin, resetAll } = usePortfolio()
  const [newPin, setNewPin] = useState('')
  const [showPin, setShowPin] = useState(false)

  const savePin = () => {
    if (newPin.length >= 4) {
      updatePin(newPin)
      setNewPin('')
      flash()
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-divider rounded-3xl p-6 sm:p-8">
        <h3 className="font-display font-semibold text-lg mb-4 text-ink">Change Admin PIN</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1 block">New PIN (min 4 chars)</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new PIN"
                className="w-full bg-background border border-divider rounded-xl px-3 py-2.5 text-sm text-ink focus:border-accent outline-none transition pr-10"
              />
              <button onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button onClick={savePin} disabled={newPin.length < 4} className="bg-accent text-white font-semibold px-5 py-2.5 rounded-full text-sm disabled:opacity-40 transition">
            Update
          </button>
        </div>
        <p className="text-muted text-xs mt-2">Current PIN: {data.adminPin.replace(/./g, '•')}</p>
      </div>

      <div className="bg-white border border-red-200 rounded-3xl p-6 sm:p-8">
        <h3 className="font-display font-semibold text-lg mb-2 text-red-600">Danger Zone</h3>
        <p className="text-muted text-sm mb-4">Reset all portfolio data to defaults. This cannot be undone.</p>
        <button onClick={() => { if (confirm('Reset ALL data to defaults? This cannot be undone.')) { resetAll(); flash() } }} className="inline-flex items-center gap-2 bg-red-500 text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-red-600 transition">
          <RefreshCw className="h-4 w-4" /> Reset Everything
        </button>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
   SHARED FIELD
---------------------------------------------------------------- */
function AdminField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-divider rounded-xl px-3 py-2.5 text-sm text-ink focus:border-accent focus:ring-4 focus:ring-accent/15 outline-none transition"
      />
    </div>
  )
}
