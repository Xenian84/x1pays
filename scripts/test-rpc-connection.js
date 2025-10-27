#!/usr/bin/env node

import { Connection } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'packages/facilitator/.env' });

const RPC_URL = process.env.RPC_URL || 'https://rpc.mainnet.x1.xyz';

async function testRPCConnection() {
  console.log('🔗 Testing connection to X1 Mainnet...');
  console.log(`RPC URL: ${RPC_URL}\n`);

  try {
    const connection = new Connection(RPC_URL, 'confirmed');
    
    console.log('📡 Fetching network information...');
    const version = await connection.getVersion();
    console.log(`✅ Connected! Solana version: ${version['solana-core']}`);
    
    const slot = await connection.getSlot();
    console.log(`✅ Current slot: ${slot}`);
    
    const blockHeight = await connection.getBlockHeight();
    console.log(`✅ Block height: ${blockHeight}`);
    
    const recentBlockhash = await connection.getLatestBlockhash();
    console.log(`✅ Recent blockhash: ${recentBlockhash.blockhash}`);
    
    const epochInfo = await connection.getEpochInfo();
    console.log(`✅ Epoch: ${epochInfo.epoch}, Slot in epoch: ${epochInfo.slotIndex}/${epochInfo.slotsInEpoch}`);
    
    console.log('\n🎉 X1 Mainnet connection successful!');
    console.log('\nNetwork Details:');
    console.log(`  - Network: x1-mainnet`);
    console.log(`  - RPC: ${RPC_URL}`);
    console.log(`  - Status: Online ✓`);
    
    return true;
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check your internet connection');
    console.error('  2. Verify the RPC URL is correct');
    console.error('  3. Check if X1 mainnet is online');
    return false;
  }
}

testRPCConnection().then(success => {
  process.exit(success ? 0 : 1);
});
