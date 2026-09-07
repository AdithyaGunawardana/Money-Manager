import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getProfile } from '../api/auth'

export default function Profile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => { getProfile().then(setProfile) }, [])

  return (
    <div className="min-h-screen bg-page lg:pl-64">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="eyebrow mb-2">Account</p>
          <h1 className="page-title">Profile</h1>
          <p className="mt-2 text-sm text-slate-500">Your account details in one place.</p>
        </div>
        {!profile ? (
          <div className="surface p-8 text-sm text-slate-500">Loading profile...</div>
        ) : (
          <div className="surface max-w-2xl space-y-5 p-6 shadow-soft">
            <Field label="Name" value={profile.name} />
            <Field label="Email" value={profile.email} />
            <Field label="Address" value={profile.address || '—'} />
            <Field label="Member since" value={new Date(profile.createdAt).toLocaleDateString()} />
          </div>
        )}
      </main>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}
