# Enhanced Memo Format for x402 Payments

## Overview

The enhanced memo format stores all transaction metadata **directly on the X1 blockchain** using the Memo Program. This enables a **blockchain-first architecture** where all payment data is queryable without needing a centralized database.

## Memo Encoding

### How It Works

When a payment is settled, the facilitator writes a structured memo to the blockchain using the Solana Memo Program:

```typescript
// In facilitator settlement
const memoData = Buffer.from(
  `x402v1:exact:${txId}:${resourceShort}:${timestamp}`,
  'utf-8'
);

// Add to transaction
tx.add({
  keys: [],
  programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
  data: memoData,
});
```

### Memo Format Specifications

#### Settlement Transaction
```
x402v1:exact:txId:resource:timestamp
```

**Example:**
```
x402v1:exact:a46199b7:echo:1730125963
```

**Fields:**
- `x402v1` - Protocol version identifier
- `exact` - Payment scheme (exact amount matching)
- `a46199b7` - Unique 8-character hex transaction ID
- `echo` - Resource/API endpoint name
- `1730125963` - Unix timestamp (seconds)

#### Refund Transaction
```
x402v1-refund:refundId:originalTxId:timestamp
```

**Example:**
```
x402v1-refund:9fd8ae74:a46199b7:1730126021
```

**Fields:**
- `x402v1-refund` - Refund transaction identifier
- `9fd8ae74` - Unique refund ID
- `a46199b7` - Original settlement transaction ID (creates link)
- `1730126021` - Unix timestamp

## Why This Is Useful

### 1. **No Database Required** 🎯
All transaction data lives on-chain and can be queried directly from the X1 blockchain. This eliminates:
- Database setup and maintenance costs
- Data synchronization issues
- Centralized points of failure
- Complex backup/restore procedures

### 2. **Complete Auditability** 🔍
Every payment has a permanent, immutable record on the blockchain:
- Full transaction history is publicly verifiable
- Refunds are linked to original settlements via transaction ID
- Timestamp proves when payment occurred
- Resource tracking shows what was purchased

### 3. **Transaction Traceability** 🔗
The enhanced memo creates a complete payment audit trail:

```
Settlement: x402v1:exact:a46199b7:echo:1730125963
    ↓
Refund: x402v1-refund:9fd8ae74:a46199b7:1730126021
```

You can trace any refund back to its original settlement using the transaction ID.

### 4. **Resource Attribution** 📊
Track which API endpoints/resources are being used:
- Analytics: See which endpoints generate the most revenue
- Rate limiting: Track usage per resource
- Billing: Charge different rates for different resources
- Debugging: Identify which resources have payment issues

### 5. **Merchant Reconciliation** 💰
Merchants can query their own transaction history:

```typescript
// Get all payments to merchant address
const txs = await getAddressTransactions(
  merchantAddress, 
  network
);

// Parse memos to get payment details
const settlements = txs.filter(tx => 
  tx.memo?.type === 'settlement'
);

// Calculate total revenue
const totalRevenue = settlements.reduce(
  (sum, tx) => sum + tx.amount, 
  0
);
```

### 6. **Multi-Party Verification** ✅
Both buyer and merchant can independently verify payments:
- Buyer: "I paid for /api/echo at timestamp X"
- Merchant: "I received payment for /api/echo at timestamp X"
- Anyone: Can verify the transaction on X1 explorer

### 7. **Compliance & Reporting** 📋
Generate financial reports directly from blockchain:
- Export transaction history for accounting
- Prove payment compliance with timestamps
- Track refund rates and patterns
- Audit trail for regulatory compliance

## Querying Transaction History

### Frontend Example (React)

```typescript
import { getAddressTransactions } from '@x1pays/shared/blockchain';

// Fetch user's transaction history
const fetchHistory = async (walletAddress: string) => {
  const txs = await getAddressTransactions(
    walletAddress,
    'x1-testnet',
    10 // limit
  );

  // Filter by transaction type
  const settlements = txs.filter(tx => tx.memo?.type === 'settlement');
  const refunds = txs.filter(tx => tx.memo?.type === 'refund');

  return { settlements, refunds };
};
```

### Backend Example (Merchant Reports)

```typescript
// Generate monthly revenue report
async function getMonthlyReport(merchantAddress: string, month: number, year: number) {
  const txs = await getAddressTransactions(merchantAddress, 'x1-mainnet', 1000);
  
  const monthStart = new Date(year, month, 1).getTime() / 1000;
  const monthEnd = new Date(year, month + 1, 1).getTime() / 1000;
  
  const monthlyTxs = txs.filter(tx => 
    tx.memo?.type === 'settlement' &&
    tx.memo.timestamp >= monthStart &&
    tx.memo.timestamp < monthEnd
  );
  
  return {
    totalRevenue: monthlyTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0),
    transactionCount: monthlyTxs.length,
    byResource: groupBy(monthlyTxs, tx => tx.memo.resource)
  };
}
```

## Security Considerations

### Transaction ID Generation
```typescript
import { randomBytes } from 'crypto';

// Generates cryptographically secure 8-character hex ID
const txId = randomBytes(4).toString('hex');
// Example: "a46199b7"
```

**Why 8 characters?**
- 4 bytes = 32 bits = 4.3 billion possible IDs
- Collision probability extremely low for payment volumes
- Compact enough to fit in memo with other data
- Readable and easy to reference in support tickets

### Memo Parsing Validation
Always validate parsed memos:

```typescript
function parseMemo(memoString: string): ParsedMemo | null {
  if (!memoString) return null;
  
  // Settlement format validation
  if (memoString.startsWith('x402v1:')) {
    const parts = memoString.split(':');
    if (parts.length !== 5) return null; // Invalid format
    
    return {
      version: 'v1',
      type: 'settlement',
      txId: parts[2],
      resource: parts[3],
      timestamp: parseInt(parts[4])
    };
  }
  
  return null;
}
```

## Use Cases

### 1. **AI Agent Payments**
AI agents can pay for API access and prove payment:
```typescript
// Agent makes payment with resource tracking
await agent.pay({
  resource: '/api/sentiment-analysis',
  amount: '1000'
});

// API verifies payment from blockchain
const payment = await verifyPayment(agentAddress, '/api/sentiment-analysis');
```

### 2. **Microtransactions**
Accept payments as low as $0.001 with full tracking:
```
Settlement: x402v1:exact:b123c456:/api/translate:1730125963
Amount: 0.001 XNT ($0.001)
```

### 3. **Subscription Verification**
Verify active subscription by checking recent payments:
```typescript
const recentPayments = await getAddressTransactions(userAddress, 'x1-mainnet', 100);
const lastSubscriptionPayment = recentPayments.find(
  tx => tx.memo?.resource === '/api/premium' && 
  tx.memo.timestamp > thirtyDaysAgo
);
```

### 4. **Chargeback Prevention**
Immutable blockchain record prevents payment disputes:
- Buyer: "I never paid"
- Merchant: "Here's the blockchain proof: tx hash XYZ at timestamp ABC"

## Benefits Summary

| Benefit | Traditional Database | Enhanced Memo (On-Chain) |
|---------|---------------------|-------------------------|
| Setup Cost | High (infrastructure) | None (blockchain native) |
| Maintenance | Ongoing (scaling, backups) | None (blockchain handles it) |
| Auditability | Internal only | Publicly verifiable |
| Transparency | Opaque | Fully transparent |
| Dispute Resolution | He-said/she-said | Cryptographic proof |
| Data Ownership | Centralized | Decentralized |
| Recovery | Requires backups | Always on blockchain |
| Query Cost | Database reads | RPC calls (similar) |

## Conclusion

The enhanced memo format transforms the X1 blockchain into a **payment database** that provides:
- ✅ Complete transaction history
- ✅ Resource attribution and analytics
- ✅ Refund traceability
- ✅ Merchant reconciliation
- ✅ Compliance reporting
- ✅ Zero infrastructure costs

By storing all metadata on-chain, x402 payments become **self-documenting** and **independently verifiable** by all parties.
