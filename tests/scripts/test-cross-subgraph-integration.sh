#!/bin/bash

# Test Cross-Subgraph Integration with Polymarket Names
# Check if we can get question data from the Names subgraph

ORDERBOOK_URL="https://api.studio.thegraph.com/query/111767/polymarket-orderbook/version/latest"
NAMES_URL="https://api.studio.thegraph.com/query/22CoTbEtpv6fURB6moTNfJPWNUPXtiFGRA8h1zajMha3/version/latest"

echo "🔗 Testing Cross-Subgraph Integration"
echo "===================================="
echo ""

# Test 1: Get a real conditionId from Names subgraph
echo "1. Sample Question Data from Names Subgraph:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 1) { id questionID question } }"}' \
  $NAMES_URL | jq '.data.markets[0]'

# Test 2: Check if any of our markets have matching conditionIds
echo ""
echo "2. Our Markets ConditionIds:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 5) { id conditionId } }"}' \
  $ORDERBOOK_URL | jq '.data.markets[] | {id, conditionId}'

# Test 3: Test cross-subgraph lookup
echo ""
echo "3. Cross-Subgraph Lookup Test:"
REAL_CONDITION_ID=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 1) { questionID } }"}' \
  $NAMES_URL | jq -r '.data.markets[0].questionID')

echo "   Real conditionId from Names: $REAL_CONDITION_ID"

# Test 4: Look up this conditionId in our subgraph
echo ""
echo "4. Looking up real conditionId in our subgraph:"
curl -s -X POST -H "Content-Type: application/json" \
  --data "{\"query\":\"{ markets(first: 1, where: { conditionId: \\\"$REAL_CONDITION_ID\\\" }) { id conditionId } }\"}" \
  $ORDERBOOK_URL | jq '.data.markets'

echo ""
echo "📋 Analysis:"
echo "   - Names subgraph has real question data"
echo "   - Our subgraph has default conditionIds (0x0000...)"
echo "   - Need to fix conditionId mapping in our subgraph"
echo "   - Or implement cross-subgraph queries"

echo ""
echo "🔧 Solutions:"
echo "   1. Fix TokenRegistered event mapping to use real conditionIds"
echo "   2. Implement cross-subgraph queries to fetch question data"
echo "   3. Wait for new events with proper conditionIds" 