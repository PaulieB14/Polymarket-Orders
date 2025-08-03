# Polymarket Orders Subgraph - Fixed Version

This is a fixed version of the Polymarket Orders subgraph with correct contract addresses and event handlers based on the official Polymarket subgraph structure.

## 🚨 Important Notes

**This subgraph is NOT ready for deployment yet.** You need to:

1. **Update the contract address** in `subgraph.yaml` with the correct Polymarket CTF Exchange contract address
2. **Get the correct ABI** for the Polymarket contracts
3. **Update the start block** to the correct deployment block

## 🔧 What Was Fixed

### 1. Schema Structure
- Aligned with official Polymarket subgraph schema
- Uses proper entities: `Global`, `Account`, `Condition`, `OrderFilledEvent`, `EnrichedOrderFilled`, `Orderbook`
- Removed custom analytics entities that weren't working

### 2. Event Handlers
- `handleOrderFilled`: Processes order fill events with proper account tracking
- `handleOrdersMatched`: Updates global order matching statistics
- `handleConditionPreparation`: Creates market conditions
- `handleConditionResolution`: Resolves market conditions

### 3. Data Flow
- Proper account creation and tracking
- Global statistics aggregation
- Orderbook volume tracking
- Market condition management

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Update Contract Configuration
Edit `subgraph.yaml` and update:
- `address`: Replace with actual Polymarket CTF Exchange contract address
- `startBlock`: Replace with actual deployment block number

### 3. Get Correct ABI
You need to obtain the correct ABI for the Polymarket contracts. Check:
- Polymarket's official documentation
- The official Polymarket subgraph repository
- Etherscan for the contract ABI

### 4. Build and Deploy
```bash
# Generate types
npm run codegen

# Build the subgraph
npm run build

# Deploy to Graph Studio
npm run deploy
```

## 🔍 Key Differences from Original

| Original Issues | Fixed Implementation |
|----------------|---------------------|
| Wrong contract address | ✅ Placeholder for correct address |
| Missing event handlers | ✅ Complete event handler implementation |
| Schema mismatch | ✅ Aligned with official schema |
| No data indexing | ✅ Proper data flow and aggregation |

## 📊 Expected Data Structure

Once properly configured, this subgraph will provide:

- **OrderFilledEvent**: Raw order fill events with maker/taker data
- **EnrichedOrderFilled**: Processed trades with price and side information
- **Orderbook**: Market-specific trading statistics
- **Account**: User trading history and statistics
- **Condition**: Market condition data
- **Global**: Overall platform statistics

## 🚀 Next Steps

1. **Find the correct contract address** from Polymarket's documentation
2. **Get the contract ABI** and place it in `abis/Polymarket.json`
3. **Update the start block** in `subgraph.yaml`
4. **Test locally** before deploying
5. **Deploy to TheGraph**

## 📚 Resources

- [Official Polymarket Subgraph](https://docs.polymarket.com/developers/subgraph/overview)
- [Graph Protocol Documentation](https://thegraph.com/docs/)
- [Polymarket API Documentation](https://docs.polymarket.com/)

## ⚠️ Disclaimer

This is a fixed version based on the official Polymarket subgraph structure. Make sure to:
- Verify all contract addresses
- Test thoroughly before deployment
- Follow Polymarket's terms of service
- Ensure compliance with relevant regulations

## 🤝 Contributing

If you find issues or have improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.