import { Link } from 'react-router-dom';

export default function ChatSidebar({ 
    chats, 
    currentChatId, 
    onNewChat, 
    onSelectChat, 
    onDeleteChat, 
    isOpen, 
    onToggle,
    user,
    isProUser,
    onSettingsClick
}) {
    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-white border-r border-zinc-200 flex flex-col sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'} md:relative md:transform-none shadow-2xl md:shadow-none h-full`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 flex-shrink-0">
                    <Link to="/" className="flex items-center gap-2 font-bold text-lg text-black hover:opacity-70 transition">
                        <i className="fas fa-toggle-on"></i> TwinAI
                    </Link>
                    <button onClick={onToggle} className="md:hidden text-zinc-400 hover:text-black">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="p-4 flex-shrink-0">
                    <button
                        onClick={onNewChat}
                        className="w-full py-3.5 px-4 bg-black hover:bg-zinc-800 text-white rounded-xl flex items-center justify-center gap-2 transition font-medium shadow-sm hover:shadow-md transform active:scale-95"
                    >
                        <i className="fas fa-plus text-xs"></i> New Debate
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto px-3 space-y-1">
                    {chats.length === 0 ? (
                        <div className="text-center text-xs text-zinc-400 mt-10">No debates yet.</div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat.id}
                                className={`p-3 rounded-lg cursor-pointer transition flex justify-between items-center group ${
                                    chat.id === currentChatId
                                        ? 'bg-zinc-200 font-medium text-black'
                                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'
                                }`}
                                onClick={() => onSelectChat(chat.id)}
                            >
                                <span className="text-sm truncate w-40">{chat.title}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteChat(chat.id);
                                    }}
                                    className="p-1 rounded text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <i className="fas fa-trash text-xs"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-zinc-100 flex-shrink-0">
                    <div
                        onClick={onSettingsClick}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 cursor-pointer transition group relative"
                    >
                        <div className="w-9 h-9 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-sm">
                            {(user?.user_metadata?.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-800 truncate">
                                {user?.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">Settings & Account</p>
                        </div>
                        <i className="fas fa-cog text-zinc-300 group-hover:text-black transition"></i>
                    </div>
                </div>
            </aside>
            {isOpen && (
                <div
                    onClick={onToggle}
                    className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm transition-opacity"
                />
            )}
        </>
    );
}

