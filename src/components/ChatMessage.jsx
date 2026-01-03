import { marked } from 'marked';
import { useState, useRef, useEffect } from 'react';

const AGENT_A_NAME = "Agent A";
const AGENT_B_NAME = "Agent B";

export default function ChatMessage({ role, agent, content, animate = false }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechUtterance, setSpeechUtterance] = useState(null);
    const contentRef = useRef(null);

    const isSystem = role === 'system';
    const align = isSystem 
        ? 'items-center' 
        : (role === 'user' 
            ? 'items-end' 
            : (agent === AGENT_A_NAME ? 'items-start' : 'items-end'));

    const bubbleStyle = isSystem
        ? 'bg-white border-2 border-green-500/20 shadow-lg w-full max-w-2xl'
        : (role === 'user'
            ? 'bg-black text-white rounded-br-none'
            : (agent === AGENT_A_NAME
                ? 'bg-white border border-zinc-200 rounded-tl-none'
                : 'bg-zinc-100 border border-zinc-200 rounded-tr-none'));

    const copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback could be added here
        });
    };

    const shareText = (text) => {
        if (navigator.share) {
            navigator.share({ title: 'TwinAI Response', text: text }).catch(console.error);
        } else {
            copyText(text);
            alert("Copied to clipboard!");
        }
    };

    const speakText = (text) => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        setSpeechUtterance(utterance);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        return () => {
            if (speechUtterance) {
                window.speechSynthesis.cancel();
            }
        };
    }, [speechUtterance]);

    return (
        <div className={`flex flex-col ${align} mb-6 w-full ${animate ? 'bubble-enter' : ''}`}>
            <div className="text-[10px] font-bold mb-2 px-1 text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                {isSystem && <i className="fas fa-check-circle text-green-500"></i>}
                {agent}
            </div>
            <div className={`max-w-[85%] md:max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${bubbleStyle} group`}>
                <div 
                    ref={contentRef}
                    className={`prose prose-sm ${role === 'user' ? 'prose-invert' : 'prose-zinc'} max-w-none`}
                    dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
                />
                {role !== 'user' && (
                    <div className="action-bar flex gap-2 mt-3 pt-2 border-t border-black/5 justify-end w-full">
                        <button
                            onClick={() => copyText(content)}
                            className="action-btn"
                            title="Copy"
                        >
                            <i className="fas fa-copy"></i>
                        </button>
                        <button
                            onClick={() => speakText(content)}
                            className="action-btn"
                            title="Listen"
                        >
                            <i className={`fas ${isSpeaking ? 'fa-stop text-red-500' : 'fa-volume-up'}`}></i>
                        </button>
                        <button
                            onClick={() => shareText(content)}
                            className="action-btn"
                            title="Share"
                        >
                            <i className="fas fa-share-alt"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

