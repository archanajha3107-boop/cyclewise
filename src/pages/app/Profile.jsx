import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) setProfile(snap.data());
    }
    fetchProfile();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    navigate('/login');
  }

  const initials = profile?.name
    ? profile.name.slice(0, 2).toUpperCase()
    : 'CW';

  return (
    <div className="screen pb-24">

      {/* Avatar + Name */}
      <div className="flex flex-col items-center mb-6 mt-2">
        <div className="w-16 h-16 rounded-full bg-mauve flex items-center justify-center mb-3">
          <span className="text-white font-playfair text-xl font-bold">
            {initials}
          </span>
        </div>
        <h1 className="page-title text-xl">
          {profile?.name || 'Your Name'}
        </h1>
        <p className="text-muted-rose text-sm">
          Member since {new Date().getFullYear()}
        </p>
        <Link
          to="/profile/edit"
          className="text-terra text-sm mt-1"
        >
          Edit profile
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: 'Streak', value: '0 days', icon: '🔥' },
          { label: 'Logs', value: '0', icon: '📅' },
          { label: 'Avg Cycle', value: `${profile?.cycleLength || '--'} days`, icon: '🌙' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center p-3">
            <p className="text-lg">{stat.icon}</p>
            <p className="text-charcoal font-medium text-sm">
              {stat.value}
            </p>
            <p className="text-muted-rose text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Settings List */}
      <div className="card space-y-0 p-0 overflow-hidden">
        {[
          { label: 'My health & diagnosis', icon: '❤️', to: '/settings' },
          { label: 'Notifications', icon: '🔔', to: '/settings' },
          { label: 'Privacy settings', icon: '🔒', to: '/settings' },
          { label: 'About CycleWise', icon: '📖', to: '/settings' },
          { label: 'Share with a friend', icon: '🔗', to: '/settings' },
          { label: 'Help & support', icon: '💬', to: '/settings' },
        ].map((item, index) => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center justify-between px-4 py-3 hover:bg-cream transition-colors ${
              index !== 0 ? 'border-t border-blush' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span>{item.icon}</span>
              <span className="text-charcoal text-sm">
                {item.label}
              </span>
            </div>
            <span className="text-muted-rose text-sm">›</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full text-danger text-sm font-medium mt-6 py-2"
      >
        Logout
      </button>

      <Navbar />
    </div>
  );
}