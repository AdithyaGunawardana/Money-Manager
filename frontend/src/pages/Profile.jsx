import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getProfile } from '../api/auth'

export default function Profile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => { getProfile().then(setProfile) }, [])

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-4">Profile</h1>
        {!profile ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 space-y-3">
            <Field label="Name" value={profile.name} />
            <Field label="Email" value={profile.email} />
            <Field label="Address" value={profile.address || '—'} />
            <Field label="Member since" value={new Date(profile.createdAt).toLocaleDateString()} />
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  )
}
