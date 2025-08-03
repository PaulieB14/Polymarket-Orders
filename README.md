# Polymarket Orders Subgraph - Fixed Version

This is a fixed version of the Polymarket Orders subgraph with correct contract addresses and event handlers based on the official Polymarket subgraph structure.

## ✅ **Ready for Deployment**

The subgraph is now configured with the correct Polymarket contract addresses and should be ready for deployment.

## 🔧 **Configuration Details**

### **Contract Addresses**
- **Main Contract**: `0x6A9D222616C90FcA5754cd1333cFD9b7fb6a4F74` (Current UMA CTF Adapter V2)
- **Network**: Polygon
- **Start Block**: 40000000 (approximate - may need adjustment)

### **What Was Fixed**

1. **Schema Structure**
   - Aligned with official Polymarket subgraph schema
   - Uses proper entities: `Global`, `Account`, `Condition`, `OrderFilledEvent`, `EnrichedOrderFilled`, `Orderbook`
   - Removed custom analytics entities that weren't working

2. **Event Handlers**
   - `handleOrderFilled`: Processes order fill events with proper account tracking
   - `handleOrdersMatched`: Updates global order matching statistics
   - `handleConditionPreparation`: Creates market conditions
   - `handleConditionResolution`: Resolves market conditions

3. **Data Flow**
   - Proper account creation and tracking
   - Global statistics aggregation
   - Orderbook volume tracking
   - Market condition management

## 🚀 **Deployment Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/PaulieB14/Polymarket-Orders-Fixed.git
cd Polymarket-Orders-Fixed
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Authenticate with Graph Studio**
```bash
graph auth 9583a39f18d46611533f8afe3d548174
```

### **4. Generate & Build**
```bash
graph codegen && graph build
```

### **5. Deploy to Studio**
```bash
graph deploy polymarket-orderbook
```

## 📊 **Expected Data Structure**

Once deployed, this subgraph will provide:

- **OrderFilledEvent**: Raw order fill events with maker/taker data
- **EnrichedOrderFilled**: Processed trades with price and side information
- **Orderbook**: Market-specific trading statistics
- **Account**: User trading history and statistics
- **Condition**: Market condition data
- **Global**: Overall platform statistics

## 🔍 **Verification Steps**

After deployment:

1. **Check the subgraph status** in Graph Studio
2. **Monitor indexing progress** - it may take time to sync from block 40000000
3. **Test queries** to verify data is being indexed correctly
4. **Compare with official Polymarket subgraph** to ensure data consistency

## ⚠️ **Important Notes**

- **Start Block**: The current start block (40000000) is an estimate. You may need to adjust this based on when the contract was actually deployed.
- **ABI**: The current ABI includes the main events, but you may need to add more events based on the actual contract interface.
- **Indexing Time**: Starting from block 40000000 may take significant time to sync completely.

## 📚 **Resources**

- [Official Polymarket Subgraph](https://docs.polymarket.com/developers/subgraph/overview)
- [Graph Protocol Documentation](https://thegraph.com/docs/)
- [Polymarket API Documentation](https://docs.polymarket.com/)
- [Contract on PolygonScan](https://polygonscan.com/address/0x6A9D222616C90FcA5754cd1333cFD9b7fb6a4F74)

## 🤝 **Contributing**

If you find issues or have improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details.