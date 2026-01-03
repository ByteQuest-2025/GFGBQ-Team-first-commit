import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function UpgradePage() {
  const [price, setPrice] = useState("Loading...");

  useEffect(() => {
    // Fetch price logic here or from Supabase/LemonSqueezy
    setPrice("$30"); // Example static price
  }, []);

  const buyPro = () => {
    // Trigger LemonSqueezy checkout logic
    console.log("Buy Pro clicked");
  };

  return (
    <div className="min-h-screen flex flex-col font-inter bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-black/5 h-16 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight"
          >
            <img
              src="https://i.ibb.co/wr79wGNk/Whats-App-Image-2025-12-13-at-9-36-40-PM-1.jpg"
              alt="TwinAI Logo"
              className="w-9 h-9 rounded-xl shadow-lg object-cover"
            />
            TwinAI
          </a>
          <div className="flex gap-4">
            <a
              href="/app"
              className="text-sm font-medium text-zinc-500 hover:text-black transition"
            >
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-16 pb-12 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
          Simple, usage-based pricing
        </h1>
        <p className="text-zinc-500 max-w-lg mx-auto">
          Upgrade to TwinAI Pro to unlock advanced consensus models and
          unlimited Debates.
        </p>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col transition-transform duration-300 ease-in-out hover:translate-y-[-4px] hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)]">
            <h3 className="text-lg font-bold text-zinc-900">Starter</h3>
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-zinc-400">/mo</span>
            </div>
            <p className="text-sm text-zinc-500 mb-8 border-b border-zinc-100 pb-8">
              Perfect for testing the waters.
            </p>
            <ul className="flex-1 space-y-3 text-sm text-zinc-500">
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i> 1 Debates
                per day
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i> Standard
                Speed
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i> Community
                Support
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i> Future
                Updates
              </li>
            </ul>
            <a
              href="/app"
              className="w-full py-3.5 mt-6 rounded-xl border border-zinc-200 text-center font-bold text-sm hover:bg-zinc-50 transition"
            >
              Current Plan
            </a>
          </div>

          {/* Pro Plan */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col relative ring-2 ring-black/5 transition-transform duration-300 ease-in-out hover:translate-y-[-4px] hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)]">
            <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
              Recommended
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Pro Access</h3>
            <div className="mt-4 mb-6 flex items-baseline gap-1">
              <span id="price-display" className="text-4xl font-bold">
                {price}
              </span>
            </div>
            <p className="text-sm text-zinc-500 mb-8 border-b border-zinc-100 pb-8">
              For power users who need accuracy.
            </p>
            <ul className="flex-1 space-y-3 text-sm text-zinc-500">
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i>{" "}
                <strong>Unlimited</strong> Debate Chats
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i> Gemini &
                DeepSeek
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i> Analysis
                Files, images
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i> Priority
                Support
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i> Future
                Updates Custom model
              </li>
            </ul>
            <Link to
              ={'/'}
              id="buy-btn"
              className="w-full py-3.5 mt-6 rounded-xl bg-black text-white font-bold text-sm flex justify-center items-center gap-2 shadow-lg shadow-zinc-200 hover:bg-black/90 transition-transform transform hover:scale-105"
            >
              Upgrade Now <i className="fas fa-bolt"></i>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
