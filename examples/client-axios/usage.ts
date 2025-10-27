import { x402Client } from '@x1pays/client/axios';
import { Keypair } from '@solana/web3.js';

// Initialize wallet
const wallet = Keypair.generate();

// Make request with automatic payment handling
async function fetchPremiumData() {
  try {
    const response = await x402Client({
      method: 'GET',
      url: 'http://localhost:3000/premium/data',
      wallet: wallet,
      retry: {
        maxRetries: 3,
        retryDelay: 1000
      }
    });

    console.log('Data:', response.data);
    console.log('Payment:', response.payment);
    
    // {
    //   data: { ... },
    //   payment: {
    //     txHash: '...',
    //     amount: '1000',
    //     simulated: true
    //   }
    // }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

fetchPremiumData();
