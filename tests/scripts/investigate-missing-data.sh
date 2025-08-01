#!/bin/bash

# Investigate Missing Data Fields in Polymarket Subgraph
# Focuses on question, description, endDate, and resolutionSource fields

SUBGRAPH_URL="https://api.studio.thegraph.com/query/111767/polymarket-orderbook/version/latest"

echo "🔍 Investigating Missing Data Fields"
echo "===================================="
echo ""

# Test 1: Check all market fields
echo "1. Market Fields Analysis:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 5) { id marketId question description endDate resolutionSource conditionId outcomeSlotCount totalVolume totalTrades createdAt updatedAt } }"}' \
  $SUBGRAPH_URL | jq '.data.markets[] | {marketId, question, description, endDate, resolutionSource, totalVolume, totalTrades}'

# Test 2: Check if there are any markets with non-null question/description
echo ""
echo "2. Markets with Non-Null Question/Description:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 100, where: { question_not: null }) { id marketId question description } }"}' \
  $SUBGRAPH_URL | jq '.data.markets | length' | xargs echo "   Markets with question:"

curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 100, where: { description_not: null }) { id marketId question description } }"}' \
  $SUBGRAPH_URL | jq '.data.markets | length' | xargs echo "   Markets with description:"

curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 100, where: { endDate_not: null }) { id marketId endDate } }"}' \
  $SUBGRAPH_URL | jq '.data.markets | length' | xargs echo "   Markets with endDate:"

# Test 3: Check outcomes to see if they have any metadata
echo ""
echo "3. Outcomes Analysis:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ outcomes(first: 10) { id market { id marketId } outcomeIndex name description currentBid currentAsk lastTradePrice volume24h } }"}' \
  $SUBGRAPH_URL | jq '.data.outcomes | length' | xargs echo "   Total outcomes:"

# Test 4: Check if there are any microstructure events with metadata
echo ""
echo "4. Microstructure Events Analysis:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ marketMicrostructureEvents(first: 10) { id marketId eventType timestamp } }"}' \
  $SUBGRAPH_URL | jq '.data.marketMicrostructureEvents | length' | xargs echo "   Microstructure events:"

# Test 5: Check order fills to see if they contain any metadata
echo ""
echo "5. Order Fills Metadata Analysis:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ orderFills(first: 5, orderBy: timestamp, orderDirection: desc) { id marketId outcomeIndex maker taker price size timestamp } }"}' \
  $SUBGRAPH_URL | jq '.data.orderFills[] | {marketId, outcomeIndex, price, timestamp}'

# Test 6: Check schema to see what fields are available
echo ""
echo "6. Schema Analysis - Market Entity Fields:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ __schema { types { name fields { name type { name kind ofType { name kind } } } } } }"}' \
  $SUBGRAPH_URL | jq '.data.__schema.types[] | select(.name == "Market") | .fields[] | .name' | xargs echo "   Market fields:"

# Test 7: Check if there are any other entities that might contain metadata
echo ""
echo "7. Other Entities Analysis:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ __schema { types { name } } }"}' \
  $SUBGRAPH_URL | jq '.data.__schema.types[] | select(.name | contains("Question") or contains("Description") or contains("Metadata") or contains("Info")) | .name' | xargs echo "   Potential metadata entities:"

# Test 8: Check if there are any markets with different conditionId patterns
echo ""
echo "8. Condition ID Analysis:"
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"query":"{ markets(first: 10) { id marketId conditionId } }"}' \
  $SUBGRAPH_URL | jq '.data.markets[] | {marketId, conditionId}'

echo ""
echo "🔍 Investigation Summary:"
echo "========================"
echo ""
echo "❓ Why are question/description fields null?"
echo "   Possible reasons:"
echo "   1. Data comes from external sources (IPFS, APIs)"
echo "   2. Additional contract events not being handled"
echo "   3. Manual data entry required"
echo "   4. Different data source than CTF contract"
echo ""
echo "🔧 Recommendations:"
echo "   1. Check Polymarket's IPFS metadata storage"
echo "   2. Look for additional contract events"
echo "   3. Investigate external API integration"
echo "   4. Check if data is stored off-chain"
echo ""
echo "📋 Next Steps:"
echo "   1. Research Polymarket's data architecture"
echo "   2. Check for additional contract events"
echo "   3. Consider IPFS integration for metadata"
echo "   4. Implement external data fetching" 