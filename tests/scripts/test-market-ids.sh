#!/bin/bash

# Test Market ID Fixes
# Check if the market ID improvements work

SUBGRAPH_URL="https://api.studio.thegraph.com/query/111767/polymarket-orderbook/version/latest"

echo "🔧 Testing Market ID Fixes"
echo "=========================="
echo ""

# Test 1: Check current market IDs
echo "1. Current Market IDs:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 5) { id marketId conditionId } }"}' \
  $SUBGRAPH_URL | jq '.data.markets[] | {marketId, conditionId}'

# Test 2: Check order fills with new market ID format
echo ""
echo "2. Order Fills Market IDs:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orderFills(first: 5, orderBy: timestamp, orderDirection: desc) { id marketId } }"}' \
  $SUBGRAPH_URL | jq '.data.orderFills[] | {marketId}'

# Test 3: Check if any markets have non-default conditionIds
echo ""
echo "3. Markets with Non-Default Condition IDs:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 10, where: { conditionId_not: \"0x0000000000000000000000000000000000000000000000000000000000000000\" }) { id marketId conditionId } }"}' \
  $SUBGRAPH_URL | jq '.data.markets | length' | xargs echo "   Markets with real conditionIds:"

echo ""
echo "📋 Analysis:"
echo "   - If marketIds are still '0', the fix needs deployment"
echo "   - If marketIds show 'X-Y' format, the fix is working"
echo "   - Real conditionIds will enable question/description data" 