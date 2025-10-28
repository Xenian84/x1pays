# X1Pays Production Deployment Guide

**Complete step-by-step guide to deploying X1Pays to production**

This guide references all documentation files in the correct deployment sequence. Follow these steps in order for a successful production deployment.

---

## 📚 Documentation Index (Deployment Order)

### Phase 1: Understanding (Before Deployment)
1. **[README.md](./README.md)** - Project overview and quick start
2. **[X402_PROTOCOL_EXPLAINED.md](./X402_PROTOCOL_EXPLAINED.md)** - How the x402 protocol works
3. **[PRODUCTION_NOTES.md](./PRODUCTION_NOTES.md)** ⚠️ **CRITICAL** - Security requirements and production considerations

### Phase 2: Pre-Deployment Preparation
4. **[scripts/env.schema.md](./scripts/env.schema.md)** - Environment variables reference
5. **[ENHANCED_MEMO_FORMAT.md](./ENHANCED_MEMO_FORMAT.md)** - Enhanced memo specification (technical reference)

### Phase 3: Production Deployment
6. **[MAINNET_SETUP.md](./MAINNET_SETUP.md)** 🚀 **START HERE FOR DEPLOYMENT** - Complete mainnet deployment instructions

### Phase 4: Publishing Packages (Optional)
7. **[PUBLISHING.md](./PUBLISHING.md)** - How to publish packages to npm (if you want others to use your SDK)

### Reference Documentation
- **[PAYAI_COMPARISON.md](./PAYAI_COMPARISON.md)** - Comparison with PayAI competitor
- **[MEMO_RESEARCH.md](./MEMO_RESEARCH.md)** - Research notes on memo formats
- **[IMPLEMENTATION_AUDIT.md](./IMPLEMENTATION_AUDIT.md)** - Implementation audit notes
- **[replit.md](./replit.md)** - Replit environment configuration

---

## 🚀 Quick Deployment Checklist

Follow this checklist to deploy X1Pays to production:

### □ Step 1: Read Requirements (30 minutes)

**Required Reading:**
- [ ] Read [README.md](./README.md) - Understand project architecture
- [ ] Read [X402_PROTOCOL_EXPLAINED.md](./X402_PROTOCOL_EXPLAINED.md) - Understand payment flow
- [ ] **CRITICAL:** Read [PRODUCTION_NOTES.md](./PRODUCTION_NOTES.md) - Understand security requirements

**Key Takeaway:** The current MVP uses signature-only verification. For production, you need to implement **delegate approval pattern** or **buyer-signed transactions**.

---

### □ Step 2: Prepare Environment (1 hour)

**Documentation:** [scripts/env.schema.md](./scripts/env.schema.md)

#### 2.1 Generate Wallets

```bash
# Generate fee payer wallet (pays all gas fees)
node scripts/seed-merchant-wallet.js

# Generate merchant wallet (receives payments)
node scripts/seed-merchant-wallet.js

# Save both private keys securely!
```

#### 2.2 Create Environment Files

**Facilitator** (`packages/facilitator/.env`):
```bash
RPC_URL=https://rpc.x1.xyz
NETWORK=x1-mainnet
WXNT_MINT=<your-wxnt-token-mint-address>
FEE_PAYER_SECRET=<base58-private-key>
PORT=4000
```

**API** (`packages/api/.env`):
```bash
RPC_URL=https://rpc.x1.xyz
NETWORK=x1-mainnet
WXNT_MINT=<your-wxnt-token-mint-address>
PAYTO_ADDRESS=<merchant-wallet-public-key>
FACILITATOR_URL=http://localhost:4000
DOMAIN=yourdomain.com
PORT=3000
```

**Website** (`packages/website/.env.local`):
```bash
VITE_NETWORK=x1-mainnet
VITE_X1_MAINNET_RPC=https://rpc.x1.xyz
VITE_X1_TESTNET_RPC=https://rpc-testnet.x1.xyz
VITE_FACILITATOR_URL=https://facilitator.yourdomain.com
VITE_MERCHANT_ADDRESS=<merchant-wallet-public-key>
VITE_WXNT_MINT=<your-wxnt-token-mint-address>
```

#### 2.3 Fund Wallets

- [ ] Send XNT to fee payer wallet (for gas fees)
- [ ] Create wXNT token accounts for merchant wallet
- [ ] Test transactions on testnet first

---

### □ Step 3: Deploy to Server (2 hours)

**Documentation:** [MAINNET_SETUP.md](./MAINNET_SETUP.md)

#### 3.1 Server Setup (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y git curl ufw nginx certbot python3-certbot-nginx

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm and PM2
sudo npm i -g pnpm pm2

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

#### 3.2 Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/x1pays.git
cd x1pays

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Copy environment files (created in Step 2)
cp /path/to/facilitator/.env packages/facilitator/.env
cp /path/to/api/.env packages/api/.env
cp /path/to/website/.env.local packages/website/.env.local

# Start services with PM2
pm2 start ops/ecosystem.config.js
pm2 save
pm2 startup
```

#### 3.3 Configure Nginx

```bash
# Update paths in nginx.conf to match your installation
sudo cp ops/nginx.conf /etc/nginx/sites-available/x1pays
sudo ln -s /etc/nginx/sites-available/x1pays /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3.4 Setup SSL Certificates

```bash
sudo certbot --nginx \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  -d facilitator.yourdomain.com
```

---

### □ Step 4: Verify Deployment (30 minutes)

#### 4.1 Health Checks

```bash
# Facilitator
curl https://facilitator.yourdomain.com/health

# API
curl https://api.yourdomain.com/health

# Website
curl https://yourdomain.com
```

#### 4.2 Test Payment Flow

```bash
# Test 402 response
curl -i https://api.yourdomain.com/premium/data

# Should return:
# HTTP/1.1 402 Payment Required
# X-Payment-Required: {...}
```

#### 4.3 End-to-End Test

Visit `https://yourdomain.com/echo` and:
- [ ] Connect wallet
- [ ] Click "Test Payment"
- [ ] Verify signature verification works (~50ms)
- [ ] Verify blockchain settlement succeeds
- [ ] Check transaction on X1 explorer

---

### □ Step 5: Monitoring & Security (1 hour)

#### 5.1 Setup Monitoring

```bash
# PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# View logs
pm2 logs facilitator
pm2 logs api
pm2 logs website
```

#### 5.2 Security Checklist

- [ ] **CRITICAL:** Implement delegate approval pattern (see PRODUCTION_NOTES.md)
- [ ] Enable rate limiting (already configured)
- [ ] Monitor facilitator wallet balance
- [ ] Setup log aggregation
- [ ] Configure backup for .env files (encrypted)
- [ ] Enable auto-renewal for SSL certificates
- [ ] Setup alerts for failed transactions

#### 5.3 Backup Strategy

```bash
# Backup environment files (encrypt before storing!)
tar -czf env-backup-$(date +%Y%m%d).tar.gz \
  packages/facilitator/.env \
  packages/api/.env \
  packages/website/.env.local

# Encrypt with gpg
gpg -c env-backup-*.tar.gz

# Store encrypted backup securely
# Delete unencrypted tar.gz file
```

---

### □ Step 6: Publish Packages (Optional, 2 hours)

**Documentation:** [PUBLISHING.md](./PUBLISHING.md)

If you want developers to use your SDK:

```bash
# Create npm organization
# Visit https://www.npmjs.com/ → Add Organization → "x1pays"

# Login to npm
npm login

# Publish packages
cd packages/client && npm publish --access public
cd ../middleware && npm publish --access public
cd ../sdk && npm publish --access public
cd ../x402-x1-react && npm publish --access public
```

---

## 🎯 Production Architecture

```
                    Internet
                       │
                       ▼
                 ┌──────────┐
                 │  Nginx   │ (SSL, Reverse Proxy)
                 └──────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │Website  │  │   API   │  │Facilit. │
    │  :5000  │  │  :3000  │  │  :4000  │
    └─────────┘  └─────────┘  └─────────┘
         │             │             │
         └─────────────┴─────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  X1 Blockchain │
              │  (wXNT Token)  │
              └────────────────┘
```

---

## ⚠️ Critical Production Notes

### Security Warning

**The current MVP implementation is NOT production-ready for real money.**

**Why?** The facilitator can transfer tokens from buyer wallets without their explicit transaction signature. This is a **security risk** in production.

**Required for Production:** Implement one of these patterns:

1. **Delegate Approval Pattern** (Recommended)
   - Buyer pre-approves facilitator as delegate
   - Facilitator transfers using delegate authority
   - See PRODUCTION_NOTES.md Section 3.1

2. **Buyer-Signed Transactions**
   - Buyer signs the full transaction
   - Facilitator submits signed transaction
   - See PRODUCTION_NOTES.md Section 3.2

**DO NOT skip this step for production deployment with real money!**

---

## 📊 Post-Deployment Checklist

### First 24 Hours
- [ ] Monitor facilitator logs for errors
- [ ] Check blockchain transactions on X1 explorer
- [ ] Verify merchant wallet receives payments
- [ ] Test from multiple wallets/browsers
- [ ] Monitor server resource usage (CPU, RAM, disk)

### First Week
- [ ] Implement replay attack prevention (nonces)
- [ ] Setup automated backups
- [ ] Configure monitoring alerts
- [ ] Test failure scenarios (network errors, insufficient balance)
- [ ] Optimize payment flow based on metrics

### First Month
- [ ] Review transaction costs and optimize gas usage
- [ ] Implement dynamic pricing if needed
- [ ] Add comprehensive metrics/analytics
- [ ] Consider Redis for distributed rate limiting
- [ ] Plan for scaling (load balancing, CDN)

---

## 🆘 Troubleshooting

### Common Issues

**1. "Transaction failed: insufficient funds"**
- Check fee payer wallet has enough XNT for gas
- Verify buyer has wXNT tokens

**2. "Network error" / RPC connection failed**
- Verify RPC_URL is correct (https://rpc.x1.xyz)
- Check RPC endpoint is responding: `curl -X POST https://rpc.x1.xyz -d '{"jsonrpc":"2.0","method":"getVersion","id":1}'`

**3. "Payment verification failed"**
- Check facilitator is running: `pm2 status`
- Verify FACILITATOR_URL is accessible from API server
- Check facilitator logs: `pm2 logs facilitator`

**4. "Invalid signature"**
- Ensure wallet is connected properly
- Verify network matches (mainnet vs testnet)
- Check browser console for errors

**5. Website shows blank page**
- Run `pnpm build` in packages/website
- Check nginx is serving from correct dist/ directory
- Verify SSL certificates are valid

**6. PM2 processes keep restarting**
- Check logs: `pm2 logs`
- Verify all .env files exist and are valid
- Check port conflicts: `sudo netstat -tulpn | grep :4000`

---

## 📞 Support & Resources

- **Documentation:** https://x1pays.xyz/docs (after deployment)
- **GitHub Issues:** https://github.com/yourusername/x1pays/issues
- **X1 Blockchain Docs:** https://docs.x1.xyz
- **Protocol Specification:** [X402_PROTOCOL_EXPLAINED.md](./X402_PROTOCOL_EXPLAINED.md)

---

## 🔐 Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Rotate secrets regularly** - Fee payer keys, API keys
3. **Use HTTPS everywhere** - Configured in nginx
4. **Monitor failed transactions** - Setup alerts
5. **Implement delegate approval** - Required for production
6. **Rate limit aggressively** - Already configured
7. **Backup private keys** - Encrypted, offline storage
8. **Keep software updated** - Regular security patches

---

## 📈 Scaling Considerations

When your traffic grows:

1. **Load Balancing**
   - Run multiple API instances behind nginx
   - Use PM2 cluster mode: `pm2 start app.js -i max`

2. **Database** (Future)
   - Add PostgreSQL for payment history
   - Cache payment verifications in Redis

3. **CDN**
   - Serve static website assets via CloudFlare/Fastly
   - Cache public API responses

4. **Monitoring**
   - Prometheus + Grafana for metrics
   - Sentry for error tracking
   - CloudWatch/Datadog for infrastructure

---

**Last Updated:** October 28, 2025  
**Version:** 0.1.0  
**Status:** Production deployment ready (with security upgrades)
