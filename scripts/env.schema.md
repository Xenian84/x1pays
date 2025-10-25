# Environment Variables Schema

This document describes all environment variables used across X1Pays services.

## Shared Variables

These variables are used by multiple services and should be consistent across your deployment.

### `RPC_URL`

- **Description**: X1 blockchain RPC endpoint URL
- **Required**: Yes
- **Default**: `https://rpc.mainnet.x1.xyz`
- **Example**: `https://rpc.mainnet.x1.xyz`
- **Used by**: Facilitator, API

### `NETWORK`

- **Description**: Network identifier for the X1 blockchain
- **Required**: Yes
- **Default**: `x1-mainnet`
- **Valid values**: `x1-mainnet`, `x1-devnet`
- **Example**: `x1-mainnet`
- **Used by**: Facilitator, API

### `WXNT_MINT`

- **Description**: SPL token mint address for wrapped XNT (wXNT) on X1
- **Required**: Yes
- **Format**: Base58-encoded Solana public key (32 bytes)
- **Example**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **Used by**: Facilitator, API, SDK (via client config)
- **Notes**: This is the official wXNT token mint on X1. Verify this address before deployment.

### `PAYTO_ADDRESS`

- **Description**: Merchant wallet public key that receives payments
- **Required**: Yes (for API)
- **Format**: Base58-encoded Solana public key
- **Example**: `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`
- **Used by**: API
- **Notes**: This is your merchant wallet. Keep the corresponding private key secure.

### `DOMAIN`

- **Description**: Public domain name for the service
- **Required**: No
- **Default**: `x1pays.xyz`
- **Example**: `x1pays.xyz`
- **Used by**: API

## Facilitator-Specific Variables

### `PORT` (Facilitator)

- **Description**: HTTP port for the facilitator service
- **Required**: No
- **Default**: `4000`
- **Example**: `4000`
- **Used by**: Facilitator

### `FEE_PAYER_SECRET`

- **Description**: Private key of the wallet that pays transaction fees on X1
- **Required**: Yes (for Facilitator)
- **Format**: Base58-encoded secret key (64 bytes)
- **Example**: `5Jv8...base58...`
- **Used by**: Facilitator
- **Security**: 🔒 **CRITICAL** - Never expose or commit this to version control. Store securely.
- **Notes**: This wallet must be funded with native XNT to pay transaction fees.

## API-Specific Variables

### `PORT` (API)

- **Description**: HTTP port for the API service
- **Required**: No
- **Default**: `3000`
- **Example**: `3000`
- **Used by**: API

### `FACILITATOR_URL`

- **Description**: URL of the facilitator service
- **Required**: Yes (for API)
- **Example**: `http://localhost:4000` (dev), `https://facilitator.x1pays.xyz` (prod)
- **Used by**: API
- **Notes**: The API service calls the facilitator to verify and settle payments.

## SDK Configuration

The SDK does not use environment variables directly. Instead, configuration is passed programmatically:

```typescript
const config: PayConfig = {
  facilitatorUrl: "https://facilitator.x1pays.xyz",
  payTo: "MerchantPubkey...",
  asset: "wXNTMint...",
  network: "x1-mainnet",
  amountAtomic: "1000"
};
```

## Security Best Practices

1. **Never commit secrets**: Always use `.env` files (gitignored) or secret management systems
2. **File permissions**: Set `.env` files to 600 (read/write owner only)
   ```bash
   chmod 600 packages/facilitator/.env
   chmod 600 packages/api/.env
   ```
3. **Production secrets**: Use environment-specific secret management:
   - AWS Secrets Manager
   - HashiCorp Vault
   - Kubernetes Secrets
   - Replit Secrets (for Replit deployments)
4. **Key rotation**: Regularly rotate `FEE_PAYER_SECRET` and update configuration
5. **Monitoring**: Log all secret access attempts (without logging the secrets themselves)

## Example .env Files

### Facilitator

```bash
PORT=4000
RPC_URL=https://rpc.mainnet.x1.xyz
NETWORK=x1-mainnet
WXNT_MINT=YourWXNTMintAddress
FEE_PAYER_SECRET=YourBase58SecretKey
```

### API

```bash
PORT=3000
RPC_URL=https://rpc.mainnet.x1.xyz
NETWORK=x1-mainnet
WXNT_MINT=YourWXNTMintAddress
PAYTO_ADDRESS=YourMerchantPubkey
FACILITATOR_URL=http://localhost:4000
DOMAIN=x1pays.xyz
```

## Network-Specific Configuration

### Mainnet (x1-mainnet)

- `RPC_URL`: `https://rpc.mainnet.x1.xyz`
- `NETWORK`: `x1-mainnet`
- `WXNT_MINT`: Official mainnet wXNT mint address

### Devnet (x1-devnet)

- `RPC_URL`: `https://rpc.devnet.x1.xyz`
- `NETWORK`: `x1-devnet`
- `WXNT_MINT`: Devnet wXNT mint address (for testing)

## Troubleshooting

### Common Issues

1. **"Invalid RPC endpoint"**: Verify `RPC_URL` is accessible and supports the required methods
2. **"Insufficient funds"**: Ensure `FEE_PAYER_SECRET` wallet has XNT for transaction fees
3. **"Invalid signature"**: Check that `WXNT_MINT` and `NETWORK` match between services
4. **"Connection timeout"**: Verify `FACILITATOR_URL` is correct and service is running

## Validation

Use the provided validation script to check your environment:

```bash
node scripts/validate-env.js
```

This will verify:
- All required variables are set
- Public keys are valid base58 Solana addresses
- Secret keys are properly formatted
- RPC endpoint is accessible
- Network configuration is consistent
