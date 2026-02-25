import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
  loading: boolean;
}

export function ChatInput({ onSend, disabled, loading }: Props) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled || loading) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-surface-border bg-surface-raised p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Connect wallet to start...' : 'Ask anything — /balance, /swap, /send, or just chat...'}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-surface-overlay border border-surface-border rounded-xl px-4 py-3 text-[15px] text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-accent/30 transition disabled:opacity-30"
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || loading || !input.trim()}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-white hover:brightness-110 transition disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>

      <div className="flex gap-2 mt-2 max-w-4xl mx-auto">
        {['/balance', '/portfolio', '/price WXNT'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => { setInput(cmd); inputRef.current?.focus(); }}
            disabled={disabled}
            className="text-[11px] font-mono text-white/15 hover:text-accent-light/40 transition px-2 py-1 rounded-md hover:bg-surface-overlay disabled:opacity-30"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
