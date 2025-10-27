#!/bin/bash

echo "🔍 X1 Mainnet Connection Check"
echo "================================"
echo ""

RPC_URL="https://rpc.mainnet.x1.xyz"

echo "📡 Testing RPC endpoint: $RPC_URL"
echo ""

# Test 1: Get version
echo "1️⃣  Fetching network version..."
VERSION=$(curl -s -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getVersion"}')

if echo "$VERSION" | grep -q "solana-core"; then
  echo "✅ Connection successful!"
  echo "$VERSION" | jq '.'
else
  echo "❌ Connection failed"
  echo "$VERSION"
  exit 1
fi

echo ""

# Test 2: Get current slot
echo "2️⃣  Fetching current slot..."
SLOT=$(curl -s -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getSlot"}')

if echo "$SLOT" | grep -q "result"; then
  echo "✅ Slot fetched successfully!"
  echo "$SLOT" | jq '.'
else
  echo "❌ Failed to fetch slot"
  exit 1
fi

echo ""

# Test 3: Get block height
echo "3️⃣  Fetching block height..."
HEIGHT=$(curl -s -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getBlockHeight"}')

if echo "$HEIGHT" | grep -q "result"; then
  echo "✅ Block height fetched successfully!"
  echo "$HEIGHT" | jq '.'
else
  echo "❌ Failed to fetch block height"
  exit 1
fi

echo ""
echo "🎉 All checks passed! X1 Mainnet is online and accessible."
echo ""
echo "Network Status:"
echo "  • RPC URL: $RPC_URL"
echo "  • Status: ✅ Online"
echo "  • Ready for production use"
echo ""
