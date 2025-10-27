import { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PaymentState, X1NetworkConfig } from '../types'
import { signPayment, verifyPayment, settlePayment, usdToAtomicUnits } from '../utils/x402'

export function useX402Payment(networkConfig: X1NetworkConfig) {
  const wallet = useWallet()
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: 'idle',
  })

  const processPayment = useCallback(
    async (usdAmount: number, description: string) => {
      if (!wallet.publicKey || !wallet.signMessage) {
        throw new Error('Wallet not connected')
      }

      setPaymentState({ status: 'paying' })

      try {
        // Convert USD amount to atomic units (6 decimals)
        const atomicAmount = usdToAtomicUnits(usdAmount)

        // Create unsigned payment
        const unsignedPayment = {
          scheme: 'x402',
          network: networkConfig.rpcUrl.includes('devnet') ? 'x1-devnet' : 'x1-mainnet',
          payTo: networkConfig.treasuryAddress,
          asset: networkConfig.usdcMint,
          amount: atomicAmount,
          memo: description,
        }

        // Sign payment with wallet
        const signedPayment = await signPayment(unsignedPayment, wallet)

        // Verify payment with facilitator
        const verifyResult = await verifyPayment(networkConfig.facilitatorUrl, signedPayment)

        if (!verifyResult.valid) {
          throw new Error('Payment verification failed: ' + (verifyResult.message || 'Unknown error'))
        }

        // Settle payment with facilitator
        const settleResult = await settlePayment(networkConfig.facilitatorUrl, signedPayment)

        setPaymentState({ 
          status: 'success', 
          txId: settleResult.txHash 
        })

        return settleResult.txHash
      } catch (error) {
        const err = error as Error
        setPaymentState({ status: 'error', error: err })
        throw err
      }
    },
    [wallet, networkConfig]
  )

  const reset = useCallback(() => {
    setPaymentState({ status: 'idle' })
  }, [])

  return {
    paymentState,
    processPayment,
    reset,
  }
}
