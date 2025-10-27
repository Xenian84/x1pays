import { fetchX402JSON } from '@x1pays/client/fetch';
import { Keypair } from '@solana/web3.js';

// Initialize wallet
const wallet = Keypair.generate();

// Make request with automatic payment handling
async function fetchPremiumData() {
  try {
    const response = await fetchX402JSON('http://localhost:3000/premium/data', {
      method: 'GET',
      wallet: wallet,
      paymentTimeout: 10000
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
