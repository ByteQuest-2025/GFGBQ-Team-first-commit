import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// marked is not used directly in ChatApp, only in ChatMessage
import { requireAuth, supabase, dbFetchChats, dbCreateChat, dbFetchMessages, dbSaveMessage, dbDeleteChat, checkDailyLimit } from '../lib/supabase';
import { callTwinFunction } from '../lib/brain';
import { extractTextFromFile } from '../lib/fileExtraction';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import SettingsModal from '../components/SettingsModal';
import UpgradeModal from '../components/UpgradeModal';

const AGENT_A_NAME = "Agent A";
const AGENT_B_NAME = "Agent B";

export default function ChatApp() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isProUser, setIsProUser] = useState(false);
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedTextContent, setExtractedTextContent] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [upgradeOpen, setUpgradeOpen] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        requireAuth(async (userData) => {
            setUser(userData);
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_pro')
                .eq('id', userData.id)
                .single();
            setIsProUser(profile ? profile.is_pro : false);
            loadHistory();
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loadingText]);

    const loadHistory = async () => {
        const chatsData = await dbFetchChats();
        setChats(chatsData);
    };

    const initNewChat = () => {
        setCurrentChatId(null);
        setMessages([]);
        loadHistory();
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const loadChat = async (chatId) => {
        if (currentChatId === chatId) return;
        setCurrentChatId(chatId);
        loadHistory();
        if (window.innerWidth < 768) setSidebarOpen(false);
        
        const messagesData = await dbFetchMessages(chatId);
        setMessages(messagesData);
    };

    const handleDeleteChat = async (chatId) => {
        if (!confirm("Delete this debate?")) return;
        await dbDeleteChat(chatId);
        if (currentChatId === chatId) initNewChat();
        else loadHistory();
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFilePreview({ name: file.name, status: 'Extracting...' });
        setIsExtracting(true);

        try {
            const text = await extractTextFromFile(file);
            setExtractedTextContent(`[FILE CONTENT: ${file.name}]\n${text}\n[END FILE CONTENT]`);
            setFilePreview({ name: file.name, status: 'Ready' });
        } catch (e) {
            setFilePreview({ name: file.name, status: 'Error' });
            alert("Extraction failed.");
            clearFile();
        } finally {
            setIsExtracting(false);
        }
    };

    const clearFile = () => {
        setExtractedTextContent(null);
        setFilePreview(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleSend = async () => {
        if (isProcessing || isExtracting) return;
        const text = inputText.trim();
        if (!text && !extractedTextContent) return;

        const allowed = await checkDailyLimit();
        if (!allowed) {
            setUpgradeOpen(true);
            return;
        }

        const titleText = text || "File Analysis";
        
        let chatId = currentChatId;
        if (!chatId) {
            const newChat = await dbCreateChat(titleText.substring(0, 25) + "...");
            chatId = newChat.id;
            setCurrentChatId(chatId);
            setMessages([]);
            loadHistory();
        }

        setIsProcessing(true);
        setInputText('');

        try {
            let finalContent = text;
            let displayContent = text;
            if (extractedTextContent) {
                finalContent = `${text}\n\n${extractedTextContent}`;
                displayContent = `[File: ${filePreview.name}]\n${text}`;
                clearFile();
            }

            // Add user message
            const userMessage = { role: 'user', agent: 'You', content: displayContent };
            setMessages(prev => [...prev, userMessage]);
            await dbSaveMessage(chatId, 'user', finalContent, 'You');

            // Agent A
            setLoadingText('TwinAI is thinking...');
            const contextA = [{ role: "user", content: finalContent }];
            const response1 = await callTwinFunction('agent-a', contextA);
            
            setLoadingText('Agent A is answering...');
            const agentAMessage = { role: 'assistant', agent: AGENT_A_NAME, content: response1 };
            setMessages(prev => [...prev, agentAMessage]);
            await dbSaveMessage(chatId, 'assistant', response1, AGENT_A_NAME);

            // Agent B
            setLoadingText('Agent B is discussing...');
            const contextB = [{ role: "user", content: `User said: "${finalContent}". Agent A said: "${response1}". Discuss this. Do you agree? Keep it concise.` }];
            const response2 = await callTwinFunction('agent-b', contextB);
            
            setLoadingText('');
            const agentBMessage = { role: 'assistant', agent: AGENT_B_NAME, content: response2 };
            setMessages(prev => [...prev, agentBMessage]);
            await dbSaveMessage(chatId, 'assistant', response2, AGENT_B_NAME);

            // Consensus
            setLoadingText('Finalizing answer...');
            const contextC = [{ role: "user", content: `Agent A said: "${response1}". Agent B said: "${response2}". Provide the FINAL answer to user. No fluff. 100-150 words max.` }];
            const response3 = await callTwinFunction('consensus', contextC);
            
            setLoadingText('');
            const consensusMessage = { role: 'system', agent: 'Consensus', content: response3 };
            setMessages(prev => [...prev, consensusMessage]);
            await dbSaveMessage(chatId, 'system', response3, 'Consensus');

        } catch (error) {
            setLoadingText('');
            const errorMessage = { role: 'system', agent: 'System', content: 'Error: ' + error.message };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
            if (inputRef.current) inputRef.current.focus();
        }
    };

    const sendButtonDisabled = isProcessing || isExtracting || (!inputText.trim() && !extractedTextContent);
    const sendButtonClass = isExtracting
        ? "send-btn processing"
        : sendButtonDisabled
        ? "send-btn"
        : "send-btn ready";

    return (
        <div className="flex h-[100dvh] w-full app-body">
            <ChatSidebar
                chats={chats}
                currentChatId={currentChatId}
                onNewChat={initNewChat}
                onSelectChat={loadChat}
                onDeleteChat={handleDeleteChat}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                user={user}
                isProUser={isProUser}
                onSettingsClick={() => setSettingsOpen(true)}
            />

            <main className="flex-1 flex flex-col h-full bg-[#FAFAFA] relative w-full overflow-hidden">
                <header className="h-16 md:hidden flex items-center justify-between px-4 border-b border-zinc-200 bg-white z-20 flex-shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-500">
                        <i className="fas fa-bars"></i>
                    </button>
                    <span className="font-bold text-black">TwinAI</span>
                    <div className="w-8"></div>
                </header>

                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth min-h-0">
                    {messages.length === 0 && !loadingText ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-100 transition-opacity mt-20">
                            <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
                                <i className="fas fa-fingerprint text-3xl text-zinc-300"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Start TwinAI</h2>
                            <p className="text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
                                Ask your Questions? for Combine the ideas from both agents into one cohesive, high-quality answer.
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => (
                                <ChatMessage
                                    key={idx}
                                    role={msg.role}
                                    agent={msg.agent}
                                    content={msg.content}
                                    animate={true}
                                />
                            ))}
                            {loadingText && (
                                <div className="flex justify-center items-center py-6 space-x-2">
                                    <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <span className="text-xs text-zinc-400 ml-2 font-mono animate-pulse">{loadingText}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-3 md:p-6 bg-[#FAFAFA] border-t border-zinc-200 z-20 flex-shrink-0 pb-[env(safe-area-inset-bottom)]">
                    <div className="max-w-3xl mx-auto input-wrapper p-2 relative">
                        {filePreview && (
                            <div className="mb-2 ml-1">
                                <div className="file-card inline-flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-600">
                                    <i className="fas fa-file"></i>
                                    <div className="flex flex-col">
                                        <span className="font-medium truncate max-w-[150px]">{filePreview.name}</span>
                                        <span className="text-[10px] text-zinc-400">{filePreview.status}</span>
                                    </div>
                                    <button onClick={clearFile} className="ml-2 text-zinc-400 hover:text-red-500">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="flex items-end gap-2">
                            <button
                                onClick={() => inputRef.current?.click()}
                                className="p-2 text-zinc-400 hover:text-black transition"
                                title="Add File"
                            >
                                <i className="fas fa-plus-circle text-xl"></i>
                            </button>
                            <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf,.txt,.js,.html,.css,.md,.csv"
                                onChange={handleFileSelect}
                            />
                            <textarea
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                rows="1"
                                className="w-full bg-transparent text-zinc-900 text-sm max-h-32 py-2 focus:outline-none placeholder-zinc-400 resize-none overflow-hidden"
                                placeholder="Message TwinAI..."
                            />
                            <button
                                onClick={handleSend}
                                disabled={sendButtonDisabled}
                                className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center ${sendButtonClass}`}
                                title="Send"
                            >
                                <i className="fas fa-arrow-up text-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                user={user}
                isProUser={isProUser}
                onUpdate={(updatedUser) => setUser(updatedUser)}
            />

            <UpgradeModal
                isOpen={upgradeOpen}
                onClose={() => setUpgradeOpen(false)}
            />
        </div>
    );
}

