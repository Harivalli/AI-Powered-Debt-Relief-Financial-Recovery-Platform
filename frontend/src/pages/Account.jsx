import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Settings</div>
          <h1>Your Account</h1>
          <p>Personal information tied to your FinRelief AI account.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="field">
          <label>Full Name</label>
          <input value={user?.full_name || ''} disabled />
        </div>
        <div className="field">
          <label>Email</label>
          <input value={user?.email || ''} disabled />
        </div>
        <div className="field">
          <label>Member Since</label>
          <input value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''} disabled />
        </div>
        <p style={{ fontSize: '0.82rem' }}>
          Editing name and password is coming soon. For now, reach out to support if you need changes made.
        </p>
      </div>
    </div>
  );
}
