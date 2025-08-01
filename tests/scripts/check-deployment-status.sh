#!/bin/bash

# Check Deployment Status and Test Fixes
# Monitor the new subgraph version deployment

SUBGRAPH_URL="https://api.studio.thegraph.com/query/111767/polymarket-orderbook/version/latest"
NEW_VERSION_URL="https://api.studio.thegraph.com/query/111767/polymarket-orderbook/0.0.15"

echo "🚀 Checking Deployment Status"
echo "============================="
echo ""

echo "📊 New Version Status (0.0.15):"
NEW_STATUS=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 1) { id } }"}' \
  $NEW_VERSION_URL)

if echo "$NEW_STATUS" | grep -q "has not started syncing"; then
    echo "   Status: 🔄 SYNCING (waiting for blocks to ingest)"
    echo "   This is normal for new deployments"
else
    echo "   Status: ✅ READY"
fi

echo ""
echo "📊 Latest Version Status:"
LATEST_STATUS=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 1) { id } }"}' \
  $SUBGRAPH_URL)

if echo "$LATEST_STATUS" | grep -q "has not started syncing"; then
    echo "   Status: 🔄 SYNCING (waiting for blocks to ingest)"
else
    echo "   Status: ✅ READY"
fi

echo ""
echo "🔍 Testing Market ID Fixes (when ready):"
echo "   - New market IDs should use 'makerAssetId-takerAssetId' format"
echo "   - TokenRegistered events should use conditionId as marketId"
echo "   - Question/description fields should populate with real conditionIds"

echo ""
echo "⏰ Next Steps:"
echo "   1. Wait for syncing to complete (usually 5-15 minutes)"
echo "   2. Monitor for new TokenRegistered events"
echo "   3. Check if market IDs improve"
echo "   4. Verify question/description data appears"

echo ""
echo "📋 Deployment Info:"
echo "   - Version: 0.0.15"
echo "   - Studio URL: https://thegraph.com/studio/subgraph/polymarket-orderbook"
echo "   - New Endpoint: $NEW_VERSION_URL"
echo "   - Latest Endpoint: $SUBGRAPH_URL" 