import { Link } from 'react-router-dom';

export default function UpgradeModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md modal ${isOpen ? 'visible-modal' : 'hidden-modal'}`}>
            <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl relative transform transition-all m-4 gradient-border text-center">
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5 text-yellow-600">
                    <i className="fas fa-crown text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Daily Limit Reached</h3>
                <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                    You've used your free debate for today. Upgrade to Pro for unlimited debates and file uploads.
                </p>
                <Link
                    to="/pricing"
                    className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-sm hover:bg-zinc-800 transition flex items-center justify-center gap-2 mb-3"
                >
                    Upgrade to Pro <i className="fas fa-arrow-right"></i>
                </Link>
                <button
                    onClick={onClose}
                    className="text-zinc-400 text-xs hover:text-black transition"
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );
}

