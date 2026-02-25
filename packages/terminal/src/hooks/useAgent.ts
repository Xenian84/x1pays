import { useState, useEffect, useRef, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  toolCalls?: { tool: string; output: unknown }[];
}

interface AgentState {
  connected: boolean;
  sessionId: string | null;
  agentAddress: string | null;
  network: string | null;
}

export function useAgent(walletAddress: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<AgentState>({
    connected: false,
    sessionId: null,
    agentAddress: null,
    network: null,
  });
  const [loading, setLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    if (!walletAddress) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/agent/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'auth', walletAddress }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'session':
          setState({
            connected: true,
            sessionId: data.sessionId,
            agentAddress: data.agentAddress,
            network: data.network,
          });
          setMessages((prev) => [
            ...prev,
            {
              id: `sys-${Date.now()}`,
              role: 'system',
              content: data.restored
                ? `Welcome back! Agent wallet: ${data.agentAddress}`
                : `New session. Agent wallet: ${data.agentAddress}. Fund it to enable sends and swaps.`,
              timestamp: Date.now(),
            },
          ]);
          break;

        case 'response':
          setLoading(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `asst-${Date.now()}`,
              role: 'assistant',
              content: data.reply,
              timestamp: Date.now(),
              toolCalls: data.toolCalls,
            },
          ]);
          break;

        case 'error':
          setLoading(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: 'system',
              content: `Error: ${data.error}`,
              timestamp: Date.now(),
            },
          ]);
          break;
      }
    };

    ws.onclose = () => {
      setState((prev) => ({ ...prev, connected: false }));
      reconnectRef.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [walletAddress]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      },
    ]);

    setLoading(true);
    wsRef.current.send(JSON.stringify({ type: 'chat', message: content }));
  }, []);

  return { messages, state, loading, sendMessage };
}
