import { useRef, useEffect } from 'react';
import { useWallet } from '@ident1/x1-connector/react';
import { useAgent } from './hooks/useAgent';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';

export default function App() {
  const { account, isConnected } = useWallet();
  const walletAddress = isConnected && account ? account : null;
  const { messages, state, loading, sendMessage } = useAgent(walletAddress);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar
        connected={state.connected}
        walletAddress={walletAddress}
        agentAddress={state.agentAddress}
        network={state.network}
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="font-heading text-2xl font-bold text-white/10 mb-2">/X1_ Terminal</div>
                <p className="text-white/15 text-sm max-w-md">
                  {walletAddress
                    ? 'Connecting to agent service...'
                    : 'Connect your wallet to start chatting with your AI agent.'}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['Check my balance', 'Swap 1 USDC.x to wXNT', 'What is the price of wXNT?'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        if (state.connected) sendMessage(q);
                      }}
                      disabled={!state.connected}
                      className="text-xs text-white/15 border border-surface-border rounded-lg px-3 py-2 hover:text-accent-light/40 hover:border-accent/20 transition disabled:opacity-30"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
              {loading && (
                <div className="flex gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-overlay flex items-center justify-center">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-accent-light/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-accent-light/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-accent-light/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <ChatInput
          onSend={sendMessage}
          disabled={!state.connected}
          loading={loading}
        />
      </main>
    </div>
  );
}
