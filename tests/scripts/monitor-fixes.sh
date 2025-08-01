#!/bin/bash

# Monitor Fixes Progress
# Track when the market ID fixes start working

SUBGRAPH_URL="https://api.studio.thegraph.com/query/111767/polymarket-orderbook/version/latest"

echo "🔍 Monitoring Market ID Fixes"
echo "============================="
echo ""

# Check current data
echo "📊 Current Data Status:"
MARKETS_COUNT=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 1) { id } }"}' \
  $SUBGRAPH_URL | jq '.data.markets | length')

ORDERFILLS_COUNT=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orderFills(first: 1) { id } }"}' \
  $SUBGRAPH_URL | jq '.data.orderFills | length')

echo "   Markets: $MARKETS_COUNT"
echo "   Order Fills: $ORDERFILLS_COUNT"

# Check for new market IDs
echo ""
echo "🔍 Market ID Analysis:"
if [ "$MARKETS_COUNT" -gt 0 ]; then
    curl -s -X POST -H "Content-Type: application/json" \
      --data '{"query":"{ markets(first: 5) { id marketId conditionId } }"}' \
      $SUBGRAPH_URL | jq '.data.markets[] | {marketId, conditionId}'
else
    echo "   No markets yet - waiting for new events"
fi

# Check for new order fills
echo ""
echo "🔍 Order Fill Analysis:"
if [ "$ORDERFILLS_COUNT" -gt 0 ]; then
    curl -s -X POST -H "Content-Type: application/json" \
      --data '{"query":"{ orderFills(first: 5) { id marketId } }"}' \
      $SUBGRAPH_URL | jq '.data.orderFills[] | {marketId}'
else
    echo "   No order fills yet - waiting for new trading activity"
fi

echo ""
echo "✅ Fixes Applied:"
echo "   - TokenRegistered events now use conditionId as marketId"
echo "   - Order fills use 'makerAssetId-takerAssetId' format"
echo "   - Better conditionId handling in market creation"

echo ""
echo "⏰ Waiting for:"
echo "   1. New TokenRegistered events (for proper conditionIds)"
echo "   2. New OrderFilled events (for improved market IDs)"
echo "   3. Question/description data to populate"

echo ""
echo "📋 Expected Improvements:"
echo "   - Market IDs will show 'X-Y' format instead of '0'"
echo "   - ConditionIds will be real values instead of defaults"
echo "   - Question/description fields will populate with metadata"

echo ""
echo "🔄 Run this script periodically to monitor progress" 