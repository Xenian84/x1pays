import { FC, ReactNode, useMemo, createContext, useContext } from 'react';
import { Connection } from '@solana/web3.js';
import { AppProvider, getDefaultConfig } from '@ident1/x1-connector/react';
import { getDefaultMobileConfig } from '@ident1/x1-connector/headless';

const RPC_URL = 'https://rpc.mainnet.x1.xyz';

const ConnectionContext = createContext<{ connection: Connection }>({
  connection: new Connection(RPC_URL),
});

export function useConnection() {
  return useContext(ConnectionContext);
}

interface Props {
  children: ReactNode;
}

export const WalletContextProvider: FC<Props> = ({ children }) => {
  const connectorConfig = useMemo(() => {
    return getDefaultConfig({
      appName: 'X1Pays Terminal',
      appUrl: 'https://x1pays.xyz/terminal',
      autoConnect: true,
      enableMobile: true,
      clusters: [
        {
          id: 'solana:mainnet' as const,
          label: 'X1 Mainnet',
          url: RPC_URL,
        },
      ],
      wallets: {
        featured: ['Phantom', 'Backpack', 'Solflare'],
      },
    });
  }, []);

  const mobile = useMemo(
    () =>
      getDefaultMobileConfig({
        appName: 'X1Pays Terminal',
        appUrl: 'https://x1pays.xyz/terminal',
      }),
    [],
  );

  const connection = useMemo(
    () => new Connection(RPC_URL, { commitment: 'confirmed' }),
    [],
  );

  return (
    <AppProvider connectorConfig={connectorConfig} mobile={mobile}>
      <ConnectionContext.Provider value={{ connection }}>
        {children}
      </ConnectionContext.Provider>
    </AppProvider>
  );
};
