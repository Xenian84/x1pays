/**
 * X1Pays SDK Example - Node.js
 * 
 * This example shows how to use the @x1pay/sdk package
 * to make x402 payment-protected API calls.
 */

import { Keypair } from '@solana/web3.js';
import { getWithPayment } from '@x1pay/sdk';
import bs58 from 'bs58';
import 'dotenv/config';

async function main() {
  console.log('🚀 X1Pays SDK Example\n');

  // 1. Load your wallet keypair
  // IMPORTANT: Never commit your private keys!
  const secretKey = bs58.decode(process.env.WALLET_SECRET_KEY || '');
  const payer = Keypair.fromSecretKey(secretKey);
  
  console.log('📱 Wallet:', payer.publicKey.toBase58());

  // 2. Configure payment
  const config = {
    facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000',
    payTo: process.env.MERCHANT_ADDRESS || 'MerchantAddressHere',
    asset: process.env.WXNT_MINT || 'wXNT_Mint_Address',
    network: (process.env.NETWORK || 'x1-testnet'),
    amountAtomic: '1000' // 0.000001 wXNT
  };

  console.log('💰 Payment config:', {
    network: config.network,
    amount: '0.000001 wXNT',
    facilitator: config.facilitatorUrl
  });

  // 3. Make payment-protected API call
  try {
    console.log('\n🔄 Making payment request...');
    
    const url = process.env.API_ENDPOINT || 'http://localhost:3000/api/echo/test';
    const data = await getWithPayment(url, payer, config);
    
    console.log('\n✅ Success!');
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('402')) {
      console.error('Payment was rejected. Possible reasons:');
      console.error('  - Insufficient balance');
      console.error('  - Invalid signature');
      console.error('  - Wrong network');
    }
  }
}

main().catch(console.error);

