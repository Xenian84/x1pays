import type { ReactNode, CSSProperties } from 'react'

export interface X402PaywallProps {
  amount: number
  description: string
  network?: 'x1-mainnet' | 'x1-testnet'
  rpcUrl?: string
  treasuryAddress?: string
  facilitatorUrl?: string
  theme?: 'x1' | 'dark' | 'light' | 'custom'
  showBalance?: boolean
  showNetworkInfo?: boolean
  maxPaymentAmount?: number
  onPaymentSuccess?: (txId: string) => void
  onPaymentError?: (error: Error) => void
  onPaymentStart?: () => void
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export interface PaymentState {
  status: 'idle' | 'connecting' | 'paying' | 'success' | 'error'
  error?: Error
  txId?: string
}

export interface X1NetworkConfig {
  rpcUrl: string
  treasuryAddress: string
  facilitatorUrl: string
  usdcMint: string
}

export const X1_NETWORKS: Record<'x1-mainnet' | 'x1-testnet', X1NetworkConfig> = {
  'x1-mainnet': {
    rpcUrl: 'https://rpc.mainnet.x1.xyz',
    treasuryAddress: 'X1PaysTreasuryMainnet1111111111111111111111',
    facilitatorUrl: 'https://facilitator.x1pays.xyz',
    usdcMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  'x1-testnet': {
    rpcUrl: 'https://rpc.testnet.x1.xyz',
    treasuryAddress: 'X1PaysDevTreasury1111111111111111111111111',
    facilitatorUrl: 'https://facilitator-testnet.x1pays.xyz',
    usdcMint: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
  },
}
