import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

export default function Landing() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        playDemo();
    }, []);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsAuthenticated(true);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const openAuth = (mode) => {
        setAuthMode(mode);
        setAuthModalOpen(true);
    };

    const closeAuth = () => {
        setAuthModalOpen(false);
    };

    const playDemo = () => {
        const container = document.getElementById('hero-demo-chat');
        if (!container) return;

        const steps = [
            { type: 'user', text: "How do I validate a startup idea?", delay: 800 },
            { type: 'agent-a', text: "I suggest creating a landing page and running ads...", delay: 2000 },
            { type: 'agent-b', text: "Wait. Before spending money, interview 10 potential users first.", delay: 3500 },
            { type: 'system', text: "Consensus: Start with user interviews (free), then build a landing page.", delay: 5500 }
        ];

        let stepIndex = 0;
        const nextStep = () => {
            if (stepIndex >= steps.length) {
                setTimeout(() => {
                    container.innerHTML = '';
                    stepIndex = 0;
                    nextStep();
                }, 5000);
                return;
            }
            const item = steps[stepIndex];
            const div = document.createElement('div');
            div.className = "flex w-full mb-3 demo-bubble";

            let innerHTML = "";
            if (item.type === 'user') {
                div.classList.add('justify-end');
                innerHTML = `<div class="max-w-[85%] p-3 rounded-2xl rounded-br-none bg-black text-white text-xs shadow-sm">${item.text}</div>`;
            } else if (item.type === 'agent-a') {
                div.classList.add('justify-start');
                innerHTML = `<div class="max-w-[85%] p-3 rounded-2xl rounded-tl-none bg-white border border-zinc-200 text-zinc-600 text-xs shadow-sm"><i class="fas fa-brain text-blue-500 mr-1.5"></i> ${item.text}</div>`;
            } else if (item.type === 'agent-b') {
                div.classList.add('justify-end');
                innerHTML = `<div class="max-w-[85%] p-3 rounded-2xl rounded-tr-none bg-white border border-zinc-200 text-zinc-600 text-xs shadow-sm text-right"><i class="fas fa-search text-purple-500 mr-1.5"></i> ${item.text}</div>`;
            } else {
                div.classList.add('justify-center');
                innerHTML = `<div class="max-w-[90%] p-2 rounded-xl bg-zinc-100 text-zinc-600 text-[10px] font-medium text-center border border-zinc-200"><i class="fas fa-check-circle text-green-500 mr-1"></i> ${item.text}</div>`;
            }

            div.innerHTML = innerHTML;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;

            const nextItem = steps[stepIndex + 1];
            const waitTime = nextItem ? (nextItem.delay - item.delay) : 1000;
            stepIndex++;
            setTimeout(nextStep, waitTime);
        };
        container.innerHTML = '';
        nextStep();
    };

    return (
        <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <div className="fixed inset-0 bg-grid z-0 pointer-events-none"></div>
            <div className="orb-wrapper">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            <nav className="fixed w-full z-50 glass-nav h-20 flex items-center">
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    {/* Logo Section: Adjusted spacing for small screens */}
                    <div className="flex items-center gap-2 md:gap-2.5">
                        <img
                            src="https://i.ibb.co/wr79wGNk/Whats-App-Image-2025-12-13-at-9-36-40-PM-1.jpg"
                            alt="TwinAI Logo"
                            className="w-8 h-8 md:w-9 md:h-9 rounded-xl shadow-lg object-cover"
                        />
                        <span className="font-bold text-lg md:text-xl tracking-tight text-black">TwinAI</span>
                    </div>

                    {/* Actions Section: Responsive gaps and text sizes */}
                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Hide pricing on very small screens if necessary, or keep with smaller padding */}


                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => openAuth('login')}
                                    className="px-4 py-2 md:px-6 md:py-2.5 rounded-full btn-primary text-xs md:text-sm font-medium whitespace-nowrap"
                                >
                                    Log In
                                </button>
                            </>
                        ) : (
                            <>
                                <a
                                    href="/app"
                                    className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-white border border-zinc-200 text-xs md:text-sm font-bold text-black hover:bg-zinc-50 transition shadow-sm whitespace-nowrap"
                                >
                                    <span>Dashboard</span>
                                    <i className="fas width:20 fa-arrow-right ml-2"></i>
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20 px-6 w-full max-w-[100vw] overflow-x-hidden">
                <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-wider shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Consensus Engine
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-zinc-900">
                            AI to AI talk,<br />
                            <span className="text-zinc-400">For Your Questions?.</span>
                        </h1>
                        <p className="text-xl text-zinc-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            TwinAI forces two AI agents discuss for your question,Business plan,Accurate insights,Strategy decisions,More "expert-like" outputs, and No confusion.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                            {isAuthenticated ? (
                                <button onClick={() => navigate('/app')} className="px-8 py-4 rounded-2xl btn-primary font-semibold text-lg flex items-center justify-center gap-3">
                                    Go to Dashboard <i className="fas fa-arrow-right"></i>
                                </button>
                            ) : (
                                <button onClick={() => openAuth('signup')} className="px-8 py-4 rounded-2xl btn-primary font-semibold text-lg flex items-center justify-center gap-3">
                                    Start Chatting Free <i className="fas fa-arrow-right"></i>
                                </button>
                            )}
                            <a href="#how-it-works" className="px-8 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-50 transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                                <i className="fas fa-play-circle text-zinc-400"></i> See Logic
                            </a>
                        </div>
                        <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-zinc-500">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center text-xs">A</div>
                                <div className="w-8 h-8 rounded-full bg-zinc-300 border-2 border-white flex items-center justify-center text-xs">B</div>
                                <div className="w-8 h-8 rounded-full bg-black text-white border-2 border-white flex items-center justify-center text-xs">+</div>
                            </div>
                            <p>Powered by Multi-Agent Consensus</p>
                        </div>
                    </div>

                    <div className="hero-mockup-wrapper relative w-full max-w-md mx-auto lg:max-w-full lg:px-12 mt-12 lg:mt-0">
                        <div className="absolute top-28 left-0 md:top-1/2 md:-left-8 z-20 bg-white border border-zinc-200 px-3 py-1.5 rounded-r-lg md:rounded-lg shadow-lg text-xs font-bold text-zinc-800 animate-bounce" style={{ animationDuration: '3s' }}>
                            <i className="fas fa-brain text-blue-500 mr-1"></i> Agent A
                        </div>
                        <div className="absolute bottom-28 right-0 md:bottom-1/4 md:-right-8 z-20 bg-white border border-zinc-200 px-3 py-1.5 rounded-l-lg md:rounded-lg shadow-lg text-xs font-bold text-zinc-800 animate-bounce" style={{ animationDuration: '4s' }}>
                            <i className="fas fa-search text-purple-500 mr-1"></i> Agent B
                        </div>

                        <div className="relative border border-zinc-100 hero-mockup overflow-hidden flex flex-col h-[400px] md:h-[500px]">
                            <div className="bg-zinc-50 p-4 border-b border-zinc-100 flex items-center gap-2 shrink-0">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                                </div>
                                <div className="mx-auto bg-white px-3 py-1 rounded-md text-[10px] font-mono text-zinc-400 border border-zinc-100 shadow-sm">
                                    twinai.consensus.live
                                </div>
                            </div>

                            <div id="hero-demo-chat" className="flex-1 p-5 space-y-4 overflow-y-auto relative bg-white flex flex-col">
                            </div>

                            <div className="p-4 border-t border-zinc-100 bg-white shrink-0">
                                <div className="h-10 bg-zinc-50 rounded-xl border border-zinc-100 w-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <section id="how-it-works" className="py-24 bg-white border-t border-black-100 relative z-10 w-full overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-zinc-900 mb-4">The Ping-Pong Protocol</h2>
                        <p className="text-zinc-500">Adversarial testing guarantees 99.9% accuracy.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-zinc-200 z-0"></div>
                        <div className="relative z-10 flex flex-col items-center text-center bg-white p-4">
                            <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <i className="fas fa-lightbulb text-2xl text-blue-500"></i>
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">1. The Proposal</h3>
                            <p className="text-sm text-zinc-500">Agent A analyzes your query and drafts a detailed initial solution.</p>
                        </div>
                        <div className="relative z-10 flex flex-col items-center text-center bg-white p-4">
                            <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <i className="fas fa-search text-2xl text-purple-500"></i>
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">2. The Critique</h3>
                            <p className="text-sm text-zinc-500">Agent B reviews the draft specifically to find errors, bias, or missing logic.</p>
                        </div>
                        <div className="relative z-10 flex flex-col items-center text-center bg-white p-4">
                            <div className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <i className="fas fa-check-double text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">3. The Verdict</h3>
                            <p className="text-sm text-zinc-500">The Consensus Engine synthesizes the perfect, hallucination-free answer.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-8 bg-zinc-50 border-t border-black-100 w-full">
                <div className="container mx-auto px-6 text-center text-sm text-zinc-400">&copy; 2025 TwinAI.</div>
            </footer>

            <AuthModal isOpen={authModalOpen} onClose={closeAuth} initialMode={authMode} />
        </div>
    );
}

