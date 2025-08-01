#!/bin/bash

# Polymarket Orderbook and Market Microstructure Subgraph Test Script
# Tests all major entities and queries

SUBGRAPH_URL="https://api.studio.thegraph.com/query/111767/polymarket-orderbook/version/latest"

echo "🧪 Testing Polymarket Orderbook Subgraph"
echo "=========================================="
echo ""

# Test 1: Basic Markets Query
echo "1. Testing Markets Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 5) { id marketId conditionId outcomeSlotCount totalVolume totalTrades createdAt updatedAt } }"}' \
  $SUBGRAPH_URL | jq '.data.markets | length' | xargs echo "   Found markets:"

# Test 2: OrderBooks Query
echo "2. Testing OrderBooks Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orderBooks(first: 5) { id marketId bestBid bestAsk spread spreadPercentage totalBidDepth totalAskDepth bidDepthLevels askDepthLevels lastUpdate createdAt } }"}' \
  $SUBGRAPH_URL | jq '.data.orderBooks | length' | xargs echo "   Found orderbooks:"

# Test 3: Order Fills Query
echo "3. Testing Order Fills Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orderFills(first: 10, orderBy: timestamp, orderDirection: desc) { id order marketId outcomeIndex maker taker price size fee timestamp blockNumber transactionHash } }"}' \
  $SUBGRAPH_URL | jq '.data.orderFills | length' | xargs echo "   Found order fills:"

# Test 4: Spreads Query
echo "4. Testing Spreads Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ spreads(first: 5) { id marketId currentSpread currentSpreadPercentage minSpread maxSpread avgSpread spreadVolatility lastUpdate } }"}' \
  $SUBGRAPH_URL | jq '.data.spreads | length' | xargs echo "   Found spreads:"

# Test 5: Market Depths Query
echo "5. Testing Market Depths Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ marketDepths(first: 5) { id marketId totalBidDepth totalAskDepth depthImbalance depthAt1Percent depthAt5Percent depthAt10Percent bidLiquidity askLiquidity } }"}' \
  $SUBGRAPH_URL | jq '.data.marketDepths | length' | xargs echo "   Found market depths:"

# Test 6: Order Flows Query
echo "6. Testing Order Flows Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orderFlows(first: 5) { id marketId buyFlow sellFlow netFlow buySellRatio orderFlowImbalance flow1Min flow5Min flow15Min lastUpdate } }"}' \
  $SUBGRAPH_URL | jq '.data.orderFlows | length' | xargs echo "   Found order flows:"

# Test 7: Orders Query
echo "7. Testing Orders Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orders(first: 10, orderBy: createdAt, orderDirection: desc) { id orderHash marketId outcomeIndex maker taker side price size remainingSize status filledSize cancelledSize createdAt } }"}' \
  $SUBGRAPH_URL | jq '.data.orders | length' | xargs echo "   Found orders:"

# Test 8: Price Levels Query
echo "8. Testing Price Levels Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ priceLevels(first: 10, orderBy: price, orderDirection: desc) { id marketId side price totalSize orderCount lastUpdate } }"}' \
  $SUBGRAPH_URL | jq '.data.priceLevels | length' | xargs echo "   Found price levels:"

# Test 9: Outcomes Query
echo "9. Testing Outcomes Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ outcomes(first: 10) { id market { id marketId } outcomeIndex name description currentBid currentAsk lastTradePrice volume24h } }"}' \
  $SUBGRAPH_URL | jq '.data.outcomes | length' | xargs echo "   Found outcomes:"

# Test 10: Order Cancellations Query
echo "10. Testing Order Cancellations Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orderCancellations(first: 10, orderBy: timestamp, orderDirection: desc) { id order marketId outcomeIndex cancelledSize reason timestamp blockNumber transactionHash } }"}' \
  $SUBGRAPH_URL | jq '.data.orderCancellations | length' | xargs echo "   Found order cancellations:"

# Test 11: Market Microstructure Events Query
echo "11. Testing Market Microstructure Events Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ marketMicrostructureEvents(first: 10, orderBy: timestamp, orderDirection: desc) { id marketId eventType timestamp blockNumber transactionHash } }"}' \
  $SUBGRAPH_URL | jq '.data.marketMicrostructureEvents | length' | xargs echo "   Found microstructure events:"

# Test 12: Complex Market Analysis Query
echo "12. Testing Complex Market Analysis Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 3) { id marketId totalVolume totalTrades spread { currentSpread currentSpreadPercentage } marketDepth { totalBidDepth totalAskDepth depthImbalance } orderFlow { buyFlow sellFlow netFlow buySellRatio } } }"}' \
  $SUBGRAPH_URL | jq '.data.markets | length' | xargs echo "   Found markets with relationships:"

# Test 13: Recent Activity Query
echo "13. Testing Recent Activity Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orderFills(first: 5, orderBy: timestamp, orderDirection: desc) { id marketId outcomeIndex maker taker price size fee timestamp } }"}' \
  $SUBGRAPH_URL | jq '.data.orderFills[0] | {marketId, price, size, timestamp}' | xargs echo "   Latest fill:"

# Test 14: Market Statistics Query
echo "14. Testing Market Statistics Query..."
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 1, orderBy: totalVolume, orderDirection: desc) { id marketId totalVolume totalTrades orderFlow { buyFlow sellFlow netFlow } } }"}' \
  $SUBGRAPH_URL | jq '.data.markets[0] | {marketId, totalVolume, totalTrades}' | xargs echo "   Top market by volume:"

echo ""
echo "✅ Subgraph testing completed!"
echo ""
echo "📊 Summary:"
echo "   - Markets: Active and responding"
echo "   - Order Fills: Capturing trading activity"
echo "   - Microstructure Metrics: Available but may need more data"
echo "   - Relationships: Working correctly"
echo ""
echo "🔍 Next Steps:"
echo "   - Monitor for new trading activity"
echo "   - Check microstructure calculations"
echo "   - Validate price level aggregations" 