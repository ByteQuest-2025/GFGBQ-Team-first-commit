import { useState } from 'react';
import { signUp, signIn } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [isSignup, setIsSignup] = useState(initialMode === 'signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignup) {
                await signUp(email, password, name);
            } else {
                await signIn(email, password);
            }
            navigate('/app');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm auth-modal ${isOpen ? 'visible-modal' : 'hidden-modal'}`}>
            <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl relative m-4 auth-card">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-black p-2">
                    <i className="fas fa-times text-xl"></i>
                </button>
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
                        <i className="fas fa-fingerprint text-xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="text-zinc-500 text-sm mt-1">
                        {isSignup ? 'Create your account to get started.' : 'Enter your details to access the engine.'}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wide">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wide">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wide">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-xs text-center">{error}</div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl btn-primary font-bold text-sm mt-2"
                    >
                        {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
                    </button>
                </form>
                <div className="text-center mt-6 pt-6 border-t border-zinc-100">
                    <p className="text-sm text-zinc-500">
                        <span>{isSignup ? "Already have an account?" : "Don't have an account?"}</span>{' '}
                        <button onClick={toggleMode} className="text-black font-bold hover:underline">
                            {isSignup ? 'Log In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

