import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { InputField, PageHeader } from '../../components/UI';
import { getInitials, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateProfile(form);
    toast.success('Profile updated successfully!');
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ name: user?.name, email: user?.email, phone: user?.phone, location: user?.location });
    setEditing(false);
  };

  const INFO = [
    { icon: Mail, label: 'Email Address', value: user?.email, key: 'email' },
    { icon: Phone, label: 'Phone Number', value: user?.phone, key: 'phone' },
    { icon: MapPin, label: 'Location', value: user?.location, key: 'location' },
    { icon: Calendar, label: 'Member Since', value: formatDate(user?.joinDate), readonly: true },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account information"
        action={
          !editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary">
              <Edit3 size={15} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="btn-ghost">
                <X size={15} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <><Save size={15} /> Save Changes</>
                )}
              </button>
            </div>
          )
        }
      />

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 relative">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='4' cy='4' r='1'/%3E%3Ccircle cx='24' cy='4' r='1'/%3E%3Ccircle cx='4' cy='24' r='1'/%3E%3Ccircle cx='24' cy='24' r='1'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 border-4 border-white dark:border-slate-800 flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg">
                {getInitials(user?.name)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
                <Camera size={13} />
              </button>
            </div>
            <div className="mb-1">
              <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white">{user?.name}</h2>
              <div className="flex items-center gap-2">
                <span className={`badge ${user?.role === 'admin' ? 'badge-blue' : 'badge-green'} capitalize`}>
                  {user?.role === 'admin' ? '🛡️ Government Officer' : '🌾 Registered Farmer'}
                </span>
              </div>
            </div>
          </div>

          {/* Fields */}
          {editing ? (
            <div className="space-y-4">
              <InputField label="Full Name" id="name" type="text" icon={User} value={form.name} onChange={set('name')} />
              <InputField label="Email Address" id="email" type="email" icon={Mail} value={form.email} onChange={set('email')} />
              <InputField label="Phone Number" id="phone" type="tel" icon={Phone} value={form.phone} onChange={set('phone')} />
              <InputField label="Location" id="location" type="text" icon={MapPin} value={form.location} onChange={set('location')} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Account security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Account Security</h3>
        <div className="space-y-3">
          {[
            { label: 'Password', desc: 'Last changed 3 months ago', action: 'Change' },
            { label: 'Two-Factor Auth', desc: 'Add extra security to your account', action: 'Enable' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                onClick={() => toast.success(`${item.action} feature coming soon!`)}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card p-6 border border-red-100 dark:border-red-900/30">
        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">Danger Zone</h3>
        <p className="text-sm text-slate-400 mb-4">These actions are irreversible. Proceed with caution.</p>
        <button
          onClick={() => toast.error('Account deletion is disabled in demo mode')}
          className="px-4 py-2 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
