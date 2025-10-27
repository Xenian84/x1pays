# X1 Mainnet Setup Guide

This guide walks you through connecting X1Pays to the X1 blockchain mainnet for production deployments.

## ✅ RPC Connection Verified

**X1 Mainnet RPC:** `https://rpc.mainnet.x1.xyz`
- Status: ✅ Online
- Solana Version: 2.2.17
- Current Slot: ~4.5M+

## Prerequisites

Before connecting to mainnet, ensure you have:

1. **X1 Wallet with XNT tokens** for transaction fees
2. **wXNT tokens** for testing payments
3. **Treasury wallet address** for collecting protocol fees
4. **Merchant wallet address** for receiving payments
5. **$XPY token mint address** (if deployed)

## Step 1: Configure Facilitator for Mainnet

Edit `packages/facilitator/.env`:

```bash
# Server configuration
PORT=4000

# X1 Mainnet RPC
RPC_URL=https://rpc.mainnet.x1.xyz
NETWORK=x1-mainnet

# Token contracts (REQUIRED - update with actual addresses)
WXNT_MINT=<YOUR_WXNT_TOKEN_MINT_ADDRESS>
XPY_MINT=<YOUR_XPY_TOKEN_MINT_ADDRESS>

# Wallet configuration (REQUIRED - keep these SECRET)
FEE_PAYER_SECRET=<BASE58_ENCODED_SECRET_KEY>
TREASURY_ADDRESS=<TREASURY_PUBLIC_KEY>

# Protocol settings
FEE_PERCENT=1
```

### Important Security Notes:

⚠️ **NEVER commit your `.env` file to version control!**
⚠️ **Keep `FEE_PAYER_SECRET` absolutely secret - it controls wallet funds**
⚠️ **Use a dedicated wallet for `FEE_PAYER` with only enough XNT for gas fees**

## Step 2: Configure API for Mainnet

Edit `packages/api/.env`:

```bash
# Server configuration
PORT=3000

# X1 Mainnet RPC
RPC_URL=https://rpc.mainnet.x1.xyz
NETWORK=x1-mainnet

# Token contracts
WXNT_MINT=<SAME_AS_FACILITATOR>
XPY_MINT=<SAME_AS_FACILITATOR>

# Merchant configuration
PAYTO_ADDRESS=<MERCHANT_PUBLIC_KEY>

# Service URLs
FACILITATOR_URL=http://localhost:4000
DOMAIN=x1pays.xyz

# Protocol settings
FEE_PERCENT=1
TREASURY_ADDRESS=<TREASURY_PUBLIC_KEY>
```

## Step 3: Get wXNT Tokens

wXNT is a wrapped version of XNT (X1's native token). To get wXNT:

1. **Acquire XNT** from an exchange that supports X1
2. **Wrap XNT to wXNT** using one of these methods:
   - X1 official bridge/wrapper
   - DEX on X1 that supports XNT ↔ wXNT swaps
   - Direct token swap services

3. **Transfer wXNT** to your test wallet for making payments

## Step 4: Deploy wXNT and $XPY Tokens (If Needed)

If you haven't deployed the token contracts yet:

### Deploy wXNT Token:
```bash
# Using Solana CLI on X1 network
spl-token create-token --url https://rpc.mainnet.x1.xyz

# Save the mint address to your .env files
```

### Deploy $XPY Governance Token:
```bash
# Create $XPY token
spl-token create-token --url https://rpc.mainnet.x1.xyz

# Optional: Create initial supply
spl-token create-account <XPY_MINT> --url https://rpc.mainnet.x1.xyz
spl-token mint <XPY_MINT> 1000000 --url https://rpc.mainnet.x1.xyz
```

## Step 5: Fund Your Wallets

### Fee Payer Wallet
The fee payer needs XNT for transaction fees:
```bash
# Check balance
solana balance <FEE_PAYER_ADDRESS> --url https://rpc.mainnet.x1.xyz

# You need ~0.01 XNT for gas fees per transaction
```

### Merchant Wallet
Needs a wXNT token account to receive payments:
```bash
spl-token create-account <WXNT_MINT> \
  --owner <MERCHANT_PUBKEY> \
  --url https://rpc.mainnet.x1.xyz
```

### Treasury Wallet
Needs a wXNT token account to receive protocol fees:
```bash
spl-token create-account <WXNT_MINT> \
  --owner <TREASURY_PUBKEY> \
  --url https://rpc.mainnet.x1.xyz
```

## Step 6: Test RPC Connection

```bash
# Test mainnet connectivity
curl -X POST https://rpc.mainnet.x1.xyz \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"getVersion"
  }'

# Expected response:
# {"jsonrpc":"2.0","result":{"solana-core":"2.2.17"},"id":1}
```

## Step 7: Start Services

```bash
# Development mode (simulation)
NODE_ENV=development pnpm dev

# Production mode (real transactions)
NODE_ENV=production pnpm start
```

## Step 8: Test End-to-End Payment Flow

### 1. Test Unpaid Request:
```bash
curl -i http://localhost:3000/premium/data
# Should return: HTTP 402 Payment Required
```

### 2. Make Paid Request:
Use the client SDK or manually sign a payment:
```typescript
import { PaymentClient } from '@x1pays/client'
import { Wallet } from '@x1pays/wallet'

const client = new PaymentClient({
  apiUrl: 'http://localhost:3000'
})

const wallet = new Wallet(process.env.BUYER_PRIVATE_KEY!)

const response = await client.request({
  url: '/premium/data',
  wallet: wallet
})

console.log('Payment TX:', response.payment.merchantTx)
console.log('Fee TX:', response.payment.feeTx)
```

### 3. Verify On-Chain:
Check the transaction on X1 explorer:
```
https://explorer.x1.xyz/tx/<TRANSACTION_HASH>?cluster=mainnet
```

## Step 9: Monitor & Maintain

### Check Treasury Balance:
```bash
spl-token balance <WXNT_MINT> \
  --owner <TREASURY_ADDRESS> \
  --url https://rpc.mainnet.x1.xyz
```

### Check Merchant Balance:
```bash
spl-token balance <WXNT_MINT> \
  --owner <MERCHANT_WALLET> \
  --url https://rpc.mainnet.x1.xyz
```

### Monitor Facilitator Logs:
```bash
# Check for successful settlements
tail -f packages/facilitator/logs/facilitator.log | grep "Settlement"
```

## Production Deployment Checklist

Before going live:

- [ ] **Security Review**: Audit smart contracts and facilitator code
- [ ] **Environment Variables**: All secrets properly set and secured
- [ ] **Wallet Funding**: Fee payer has sufficient XNT for gas
- [ ] **Token Accounts**: All wallets have wXNT token accounts created
- [ ] **RPC Connection**: Verified mainnet RPC is responsive
- [ ] **SSL/HTTPS**: Production API uses HTTPS with valid certificate
- [ ] **Rate Limiting**: x420 middleware configured appropriately
- [ ] **Monitoring**: Logging and alerting set up
- [ ] **Backups**: Private keys backed up securely
- [ ] **Testing**: End-to-end payment flow tested on mainnet
- [ ] **Documentation**: API documentation updated with mainnet URLs

## Troubleshooting

### "Insufficient funds" Error
- Check fee payer wallet has XNT for gas
- Verify buyer has enough wXNT tokens

### "Account not found" Error  
- Create wXNT token accounts for all wallets
- Verify WXNT_MINT address is correct

### "Invalid signature" Error
- Check NETWORK is set to "x1-mainnet" in both services
- Verify payment signature matches payment data

### RPC Connection Issues
- Test RPC: `curl https://rpc.mainnet.x1.xyz`
- Check firewall/network settings
- Verify RPC_URL in .env files

## Support

- **Documentation**: https://x1pays.xyz/docs
- **FAQ**: https://x1pays.xyz/faq
- **Troubleshooting**: https://x1pays.xyz/docs/troubleshooting
- **GitHub**: https://github.com/x1pays/x1pays

## Security Best Practices

1. **Never expose private keys** in code, logs, or version control
2. **Use environment variables** for all sensitive configuration
3. **Separate wallets** for different purposes (fee payer, merchant, treasury)
4. **Monitor transactions** for suspicious activity
5. **Keep dependencies updated** to patch security vulnerabilities
6. **Use HTTPS only** in production
7. **Implement rate limiting** to prevent abuse
8. **Regular backups** of wallet keys and configuration
9. **Test thoroughly** on devnet before mainnet deployment
10. **Security audit** before handling real funds

---

**Ready to go live?** Make sure you've completed all steps in the checklist above!
