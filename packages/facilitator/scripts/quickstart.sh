#!/bin/bash

# X1Pays Facilitator Quickstart Script
# Sets up and starts 3 facilitator instances (alpha, beta, gamma)

set -e

GREEN='\033[0.32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}        X1Pays Facilitator Quickstart${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm not found. Please install pnpm first: npm install -g pnpm${NC}"
    exit 1
fi
echo -e "${GREEN}✓ pnpm $(pnpm -v)${NC}"

echo ""

# Check if .env files already exist
if [ -f "../.env.alpha" ] && [ -f "../.env.beta" ] && [ -f "../.env.gamma" ]; then
    echo -e "${YELLOW}⚠️  Facilitator configurations already exist.${NC}"
    read -p "Do you want to regenerate them? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}Using existing configurations.${NC}"
        SKIP_GENERATE=true
    fi
fi

# Generate wallet configurations
if [ "$SKIP_GENERATE" != "true" ]; then
    echo -e "${YELLOW}Generating facilitator wallets and configurations...${NC}"
    pnpm generate
    echo ""
fi

# Check if wallets file exists
if [ ! -f "../WALLETS.md" ]; then
    echo -e "${RED}❌ WALLETS.md not found. Please run 'pnpm generate:facilitators' first.${NC}"
    exit 1
fi

# Extract wallet addresses from .env files
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 Wallet Funding Required${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Before starting, you need to fund these wallets on X1 testnet:${NC}"
echo ""

# Function to extract address from .env file
get_address() {
    local env_file=$1
    grep "# Address:" "$env_file" | cut -d' ' -f3
}

ALPHA_ADDR=$(get_address "../.env.alpha")
BETA_ADDR=$(get_address "../.env.beta")
GAMMA_ADDR=$(get_address "../.env.gamma")

echo -e "${GREEN}Alpha Facilitator:${NC} $ALPHA_ADDR"
echo -e "${GREEN}Beta Facilitator:${NC}  $BETA_ADDR"
echo -e "${GREEN}Gamma Facilitator:${NC} $GAMMA_ADDR"
echo ""
echo -e "${YELLOW}🌊 Faucet:${NC} https://faucet.testnet.x1.xyz"
echo -e "${YELLOW}💰 Recommended:${NC} 0.1 wXNT per wallet (minimum)"
echo ""

read -p "Have you funded all 3 wallets? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Please fund the wallets and run this script again.${NC}"
    echo -e "${YELLOW}Or manually start facilitators after funding:${NC}"
    echo ""
    echo -e "  ${BLUE}pnpm dev:facilitators${NC}"
    echo ""
    exit 0
fi

echo ""
echo -e "${GREEN}✓ Wallets funded!${NC}"
echo ""

# Start facilitators
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🚀 Starting Facilitators${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}Alpha:${NC} http://localhost:4000 (fee: 0.1%)"
echo -e "${GREEN}Beta:${NC}  http://localhost:4001 (fee: 0.15%)"
echo -e "${GREEN}Gamma:${NC} http://localhost:4002 (fee: 0.2%)"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all facilitators${NC}"
echo ""

# Give user a moment to read
sleep 2

# Change to root directory and start facilitators
cd ../../..
pnpm dev:facilitators


