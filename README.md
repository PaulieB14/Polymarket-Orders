# Polymarket Orderbook and Market Microstructure Subgraph

A Graph Protocol subgraph that indexes Polymarket's orderbook data and market microstructure metrics, providing real-time analytics for trading activity, liquidity analysis, and market depth insights.

## Overview

This subgraph tracks orderbook events from Polymarket's CTF Exchange contract, including order fills, cancellations, and market microstructure data. It provides comprehensive analytics for:

- Real-time orderbook state and depth
- Market microstructure metrics (spreads, liquidity, order flow)
- Trading activity and volume analysis
- Price level aggregation and market depth visualization

## Features

### Core Functionality
- **Orderbook Tracking**: Real-time monitoring of bid/ask orders and market depth
- **Market Microstructure**: Spread analysis, liquidity metrics, and order flow tracking
- **Trading Analytics**: Volume analysis, trade frequency, and price impact metrics
- **Market Depth**: Multi-level depth analysis with configurable percentage thresholds

### Data Entities
- **Markets**: Market identification and metadata
- **OrderBook**: Current orderbook state and depth levels
- **Orders**: Individual order tracking and status management
- **OrderFills**: Trade execution records with price and volume data
- **MarketDepth**: Liquidity analysis at various price levels
- **Spread**: Bid-ask spread tracking and volatility metrics
- **OrderFlow**: Buy/sell flow analysis and imbalance detection

## Architecture

### Data Sources
- **CTF Exchange Contract**: Orderbook events (OrderFilled, OrderCancelled, OrdersMatched, TokenRegistered)
- **CTF Contract**: Market creation events (ConditionPreparation, ConditionResolution)

### Event Handlers
- `handleOrderFilled`: Processes trade executions and updates market statistics
- `handleOrderCancelled`: Tracks order cancellations and updates order status
- `handleOrdersMatched`: Handles order matching events and updates flow metrics
- `handleTokenRegistered`: Creates markets from token registration events
- `handleConditionPreparation`: Initializes market conditions and metadata
- `handleConditionResolution`: Processes market resolution events

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Graph CLI

### Setup
```bash
# Install dependencies
npm install

# Build the subgraph
npm run codegen
npm run build

# Deploy to Graph Studio
npm run deploy
```

## Configuration

### Network Configuration
The subgraph is configured for the Polygon network with the following contracts:
- **CTF Exchange**: `0x4D7C363DED4B3b4e1F954494d2Bc3955e49699cC`
- **CTF**: `0x4D7C363DED4B3b4e1F954494d2Bc3955e49699cC`

### Environment Variables
- `GRAPH_STUDIO_URL`: Graph Studio deployment endpoint
- `SUBGRAPH_NAME`: Subgraph identifier for deployment

## Usage

### GraphQL Queries

#### Market Data
```graphql
{
  markets(first: 10) {
    id
    marketId
    conditionId
    totalVolume
    totalTrades
    lastTradePrice
  }
}
```

#### Orderbook State
```graphql
{
  orderBooks(first: 5) {
    id
    marketId
    bidDepthLevels
    askDepthLevels
    totalBidDepth
    totalAskDepth
  }
}
```

#### Trading Activity
```graphql
{
  orderFills(first: 20, orderBy: timestamp, orderDirection: desc) {
    id
    marketId
    price
    size
    maker
    taker
    timestamp
  }
}
```

#### Market Microstructure
```graphql
{
  spreads(first: 10) {
    id
    marketId
    currentSpread
    currentSpreadPercentage
    avgSpread
  }
}
```

## Testing

### Test Suite
The project includes comprehensive test scripts for validation:

```bash
# Run basic functionality tests
./tests/run-tests.sh basic

# Run detailed data analysis
./tests/run-tests.sh detailed

# Run comprehensive test suite
./tests/run-tests.sh comprehensive
```

### Test Coverage
- **Basic Functionality**: Core entity creation and data integrity
- **Data Analysis**: Volume calculations, price distributions, trading patterns
- **Performance**: Query response times and data consistency
- **Edge Cases**: Error handling and boundary conditions

## Deployment

### Graph Studio
The subgraph is deployed on Graph Studio at:
```
https://api.studio.thegraph.com/query/111767/polymarket-orderbook/version/latest
```

### Deployment Process
1. Build the subgraph: `npm run build`
2. Deploy to Graph Studio: `npm run deploy`
3. Monitor syncing status using the provided test scripts
4. Verify data integrity with comprehensive tests

## Data Quality

### Known Limitations
- Question and description fields require cross-subgraph integration with Polymarket Names subgraph
- ConditionId mapping depends on TokenRegistered events with real conditionIds
- Historical data may have default conditionIds (0x0000...) until new events are processed

### Data Validation
- Automated test scripts validate data consistency
- Cross-subgraph comparison ensures data accuracy
- Real-time monitoring of data quality metrics

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Implement changes with appropriate tests
4. Submit a pull request with detailed description

### Code Standards
- TypeScript for all mapping logic
- AssemblyScript for Graph Protocol compatibility
- Comprehensive error handling and logging
- Clear documentation for all functions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:
- Create an issue in the GitHub repository
- Review the test scripts for debugging guidance
- Check the Graph Protocol documentation for subgraph development

## Related Projects

- **Polymarket Names Subgraph**: Question and market metadata
- **Goldsky Orderbook Subgraph**: Alternative orderbook implementation
- **Graph Protocol**: The underlying indexing protocol 