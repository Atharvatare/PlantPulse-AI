import { useState, useRef, useEffect } from 'react';
import { FiSend, FiTerminal, FiUser, FiZap } from 'react-icons/fi';
import { chat } from '../../services/aiService';
import { QUICK_QUERIES } from '../../utils/constants';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m your PlantPulse AI assistant. How can I help you with your industrial operations today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await chat(msg);
      const reply = res.data?.data?.response || res.data?.reply || res.data?.message || res.data?.text || 'I processed your request.';
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to get response from AI';
      setMessages((prev) => [...prev, { role: 'assistant', text: `Error: ${errMsg}` }]);
      toast.error(errMsg);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-white">AI Assistant</h1>
        <p className="text-sm text-industrial-400 mt-0.5">Ask questions about your industrial assets and operations</p>
      </div>

      <div className="flex-1 bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <FiTerminal size={16} />
                </div>
              )}
              <div className={`max-w-[80%] lg:max-w-[65%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                <div className={`p-3.5 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-sm'
                    : msg.text.startsWith('Error')
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                      : 'bg-industrial-900/60 text-industrial-200 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary-500/10 text-secondary-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <FiUser size={16} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center flex-shrink-0"><FiTerminal size={16} /></div>
              <div className="bg-industrial-900/60 rounded-xl p-4"><LoadingSpinner size="sm" /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && !loading && (
          <div className="px-4 pb-3">
            <p className="text-xs text-industrial-500 mb-2 text-center">Quick suggestions</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_QUERIES.slice(0, 6).map((q) => (
                <button key={q} onClick={() => handleSend(q)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-industrial-700/40 hover:bg-industrial-700/60 text-industrial-300 hover:text-white text-xs transition-colors border border-industrial-600/30">
                  <FiZap size={12} className="text-yellow-400" />{q.length > 35 ? q.slice(0, 35) + '...' : q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-industrial-700/50 p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your industrial assets..."
                rows={2}
                className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500 resize-none"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : <FiSend size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
