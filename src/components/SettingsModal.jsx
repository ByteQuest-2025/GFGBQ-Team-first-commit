import { useState } from 'react';
import { updateUserProfile, logout, supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function SettingsModal({ isOpen, onClose, user, isProUser, onUpdate }) {
    const [name, setName] = useState(user?.user_metadata?.full_name || '');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUserProfile(name);
            if (onUpdate) onUpdate({ ...user, user_metadata: { ...user.user_metadata, full_name: name } });
            onClose();
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm modal ${isOpen ? 'visible-modal' : 'hidden-modal'}`}>
            <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl relative transform transition-all m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-zinc-900">Account</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-black">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wide">Email</label>
                        <div className="text-sm font-medium text-zinc-800 break-all">{user?.email || '...'}</div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wide">Current Plan</label>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold ${
                            isProUser
                                ? 'bg-green-100 text-green-700'
                                : 'bg-zinc-100 text-zinc-600'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${isProUser ? 'bg-green-500' : 'bg-zinc-400'}`}></span>
                            {isProUser ? 'Pro Plan' : 'Free Tier'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:border-black"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-black text-white font-bold text-sm hover:bg-zinc-800 transition"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <hr className="border-zinc-100" />
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}

