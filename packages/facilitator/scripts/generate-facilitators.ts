#!/usr/bin/env tsx

/**
 * Generate Facilitator Wallets Script
 * 
 * Creates 3 Ed25519 keypairs for alpha, beta, and gamma facilitators
 * and generates corresponding .env files for each.
 */

import { Keypair } from '@solana/web3.js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface FacilitatorConfig {
  id: string
  name: string
  port: number
  feeBasisPoints: number
}

const facilitators: FacilitatorConfig[] = [
  { id: 'alpha', name: 'Alpha Facilitator', port: 4000, feeBasisPoints: 10 },
  { id: 'beta', name: 'Beta Facilitator', port: 4001, feeBasisPoints: 15 },
  { id: 'gamma', name: 'Gamma Facilitator', port: 4002, feeBasisPoints: 20 },
]

async function generateFacilitators() {
  console.log('🔐 Generating facilitator wallets and configurations...\n')

  const wallets: Array<{ id: string; keypair: Keypair; address: string }> = []

  for (const config of facilitators) {
    const keypair = Keypair.generate()
    const address = keypair.publicKey.toString()
    const secretArray = Array.from(keypair.secretKey)

    wallets.push({ id: config.id, keypair, address })

    const envContent = `# ${config.name} Configuration
# Auto-generated on ${new Date().toISOString()}

PORT=${config.port}

# Network Configuration
RPC_URL_TESTNET=https://rpc.testnet.x1.xyz
RPC_URL_MAINNET=https://rpc.mainnet.x1.xyz
NETWORK=x1-testnet

# Token Configuration
WXNT_MINT=So11111111111111111111111111111111111111112
USDX_MINT=B69chRzqzDCmdB5WYB8NRu5Yv5ZA95ABiZcdzCgGm9Tq

# Facilitator Identity
FACILITATOR_ID=${config.id}
FACILITATOR_NAME="${config.name}"

# Fee Configuration (basis points, e.g., 10 = 0.1%)
FEE_BASIS_POINTS=${config.feeBasisPoints}

# Wallet Configuration
# ⚠️ IMPORTANT: Fund this wallet on X1 testnet before starting!
# Address: ${address}
# Use X1 testnet faucet: https://faucet.testnet.x1.xyz
FEE_PAYER_SECRET=[${secretArray.join(',')}]

# Stats Reset Password (for development)
STATS_RESET_PASSWORD=dev-reset-2024
`

    const envPath = path.join(__dirname, '..', `.env.${config.id}`)
    await fs.writeFile(envPath, envContent, 'utf-8')

    console.log(`✅ ${config.name} (${config.id})`)
    console.log(`   Port: ${config.port}`)
    console.log(`   Fee: ${config.feeBasisPoints} basis points (${config.feeBasisPoints / 100}%)`)
    console.log(`   Address: ${address}`)
    console.log(`   Config: .env.${config.id}`)
    console.log()
  }

  // Generate summary file
  const summaryContent = `# Facilitator Wallets Summary
Generated: ${new Date().toISOString()}

## Wallet Addresses

${wallets.map(w => `### ${w.id.toUpperCase()}
Address: ${w.address}
Config: .env.${w.id}
Port: ${facilitators.find(f => f.id === w.id)?.port}
`).join('\n')}

## Funding Instructions

⚠️ **IMPORTANT**: You must fund these wallets before starting the facilitators!

### X1 Testnet Faucet
Visit: https://faucet.testnet.x1.xyz

Recommended minimum balance per wallet:
- 0.1 wXNT (~100,000,000 lamports) for testing
- 1.0 wXNT for production

### Funding Steps

1. Visit the X1 testnet faucet: https://faucet.testnet.x1.xyz
2. Copy each wallet address above
3. Request testnet tokens for each address
4. Verify balance using X1 explorer: https://explorer.xen.network

### Check Balance

\`\`\`bash
# Using X1 CLI (if installed)
x1 balance <ADDRESS> --url https://rpc.testnet.x1.xyz

# Or check via explorer
open https://explorer.xen.network/address/<ADDRESS>?cluster=testnet
\`\`\`

## Starting Facilitators

After funding wallets, start the facilitators:

\`\`\`bash
# Start all facilitators
pnpm dev:facilitators

# Or start individually
pnpm -C packages/facilitator dev:alpha
pnpm -C packages/facilitator dev:beta
pnpm -C packages/facilitator dev:gamma
\`\`\`

## Verifying Setup

1. Check health endpoints:
   - Alpha: http://localhost:4000/health
   - Beta: http://localhost:4001/health
   - Gamma: http://localhost:4002/health

2. Check Protocol Bond status:
   - Alpha: http://localhost:4000/stats
   - Beta: http://localhost:4001/stats
   - Gamma: http://localhost:4002/stats

3. Verify API registry:
   - http://localhost:3000/api/facilitators

## Security Notes

⚠️ **NEVER commit .env files to git!**
- These files contain private keys
- They are already in .gitignore
- For production, use secure key management (AWS KMS, HashiCorp Vault, etc.)

🔐 **Backup your keys securely**
- Store secret keys in a password manager
- Keep offline backups
- Use hardware wallets for production
`

  const summaryPath = path.join(__dirname, '..', 'WALLETS.md')
  await fs.writeFile(summaryPath, summaryContent, 'utf-8')

  console.log('📝 Summary saved to: WALLETS.md')
  console.log()
  console.log('🎉 Setup complete!')
  console.log()
  console.log('Next steps:')
  console.log('1. Fund the wallets using X1 testnet faucet: https://faucet.testnet.x1.xyz')
  console.log('2. Start facilitators: pnpm dev:facilitators')
  console.log('3. Check the WALLETS.md file for detailed instructions')
  console.log()
}

generateFacilitators().catch(console.error)


