#!/bin/bash

# Analyze ConditionId Mapping Across Subgraphs
# Compare our subgraph with Polymarket Names and Goldsky

ORDERBOOK_URL="https://api.studio.thegraph.com/query/111767/polymarket-orderbook/version/latest"
NAMES_URL="https://api.studio.thegraph.com/query/22CoTbEtpv6fURB6moTNfJPWNUPXtiFGRA8h1zajMha3/version/latest"
GOLDSKY_URL="https://api.goldsky.com/api/public/project_cl6mb8i9h0003e201j6li0diw/subgraphs/orderbook-subgraph/0.0.1/gn"

echo "🔍 ConditionId Mapping Analysis"
echo "==============================="
echo ""

echo "1. Our Subgraph - Market ConditionIds:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 5) { id marketId conditionId } }"}' \
  $ORDERBOOK_URL | jq '.data.markets[] | {id, marketId, conditionId}'

echo ""
echo "2. Polymarket Names Subgraph - Sample Questions:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 3) { id questionID question } }"}' \
  $NAMES_URL | jq '.data.markets[] | {id, questionID, question: (.question | .[0:100] + "...")}'

echo ""
echo "3. Goldsky Subgraph - Order Fill Events:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orderFilledEvents(first: 5) { id makerAssetId takerAssetId } }"}' \
  $GOLDSKY_URL | jq '.data.orderFilledEvents[] | {id, makerAssetId, takerAssetId}'

echo ""
echo "4. Cross-Reference Test:"
# Get a real conditionId from Names subgraph
REAL_CONDITION_ID=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 1) { questionID } }"}' \
  $NAMES_URL | jq -r '.data.markets[0].questionID')

echo "   Real conditionId from Names: $REAL_CONDITION_ID"

# Check if this conditionId exists in our subgraph
echo ""
echo "   Looking up in our subgraph:"
curl -s -X POST -H "Content-Type: application/json" \
  --data "{\"query\":\"{ markets(first: 1, where: { conditionId: \\\"$REAL_CONDITION_ID\\\" }) { id conditionId } }\"}" \
  $ORDERBOOK_URL | jq '.data.markets'

echo ""
echo "📋 Key Findings:"
echo "   - Names subgraph has real question data with conditionIds"
echo "   - Our subgraph has default conditionIds (0x0000...)"
echo "   - Goldsky subgraph also has makerAssetId=0 for many events"
echo "   - Position tokens (makerAssetId/takerAssetId) ≠ conditionIds"

echo ""
echo "🔧 Root Cause Analysis:"
echo "   1. TokenRegistered events should provide real conditionIds"
echo "   2. OrderFilled events use position token IDs, not conditionIds"
echo "   3. Need to map position tokens back to conditionIds"
echo "   4. Or wait for TokenRegistered events with real conditionIds"

echo ""
echo "💡 Solutions:"
echo "   1. Fix TokenRegistered event mapping (already done)"
echo "   2. Implement position token → conditionId mapping"
echo "   3. Cross-subgraph queries to fetch question data"
echo "   4. Wait for new events with proper conditionIds" 