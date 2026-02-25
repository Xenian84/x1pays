import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, Copy, Check } from 'lucide-react';
import {
  useWallet,
  useWalletConnectors,
  useConnectWallet,
  useDisconnectWallet,
  useAccount,
} from '@ident1/x1-connector/react';

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export function ConnectButton() {
  const { isConnected, isConnecting, account } = useWallet();
  const connectors = useWalletConnectors();
  const { connect } = useConnectWallet();
  const { disconnect } = useDisconnectWallet();
  const { copy, copied } = useAccount();
  const [open, setOpen] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowWallets(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isConnecting) {
    return (
      <button disabled className="w-full px-3 py-2.5 rounded-lg bg-accent/60 text-white text-sm font-medium flex items-center justify-center gap-2">
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Connecting...
      </button>
    );
  }

  if (isConnected && account) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-3 py-2.5 rounded-lg bg-accent text-white text-sm font-medium flex items-center justify-center gap-2 hover:brightness-110 transition cursor-pointer"
        >
          {shortenAddress(account)}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-surface-overlay border border-surface-border p-2 rounded-xl shadow-2xl z-50">
            <button
              onClick={() => copy()}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition flex items-center gap-2 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <hr className="border-surface-border my-1" />
            <button
              onClick={() => { disconnect(); setOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={14} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setShowWallets(!showWallets)}
        className="w-full px-3 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
      >
        Connect Wallet
      </button>

      {showWallets && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-surface-overlay border border-surface-border p-3 rounded-xl shadow-2xl z-50">
          <p className="text-xs text-white/25 mb-2 px-1">Select a wallet</p>
          <div className="space-y-1">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={async () => {
                  await connect(connector.id);
                  setShowWallets(false);
                }}
                disabled={!connector.ready}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.04] transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {connector.icon && (
                  <img src={connector.icon} alt="" className="w-6 h-6 rounded-md" />
                )}
                <span className="flex-1 text-left">{connector.name}</span>
                {!connector.ready && (
                  <span className="text-[10px] text-white/20">Not Found</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
