import { Bot, User, AlertCircle } from 'lucide-react';
import type { Message } from '../hooks/useAgent';

export function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const isSystem = msg.role === 'system';

  return (
    <div className={`flex gap-3 px-4 py-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser
            ? 'bg-accent/20 text-accent-light'
            : isSystem
              ? 'bg-yellow-500/10 text-yellow-500'
              : 'bg-surface-overlay text-white/60'
        }`}
      >
        {isUser ? <User size={16} /> : isSystem ? <AlertCircle size={16} /> : <Bot size={16} />}
      </div>

      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-xl px-4 py-2.5 text-[15px] leading-relaxed ${
            isUser
              ? 'bg-accent text-white rounded-br-sm'
              : isSystem
                ? 'bg-yellow-500/5 text-yellow-200/60 border border-yellow-500/10 rounded-bl-sm'
                : 'bg-surface-raised text-white/80 border border-surface-border rounded-bl-sm'
          }`}
        >
          <p className="whitespace-pre-wrap">{msg.content}</p>

          {msg.toolCalls && msg.toolCalls.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/5">
              {msg.toolCalls.map((tc, i) => (
                <div key={i} className="text-xs font-mono text-accent-light/60">
                  {tc.tool}: {typeof tc.output === 'string' ? tc.output : JSON.stringify(tc.output)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-[11px] text-white/15 mt-1 px-1">
          {new Date(msg.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
