# Polymarket Orderbook Subgraph

A Graph Protocol subgraph that indexes Polymarket's orderbook data and trading activity.

## Overview

This subgraph tracks orderbook events from Polymarket's CTF Exchange contract, providing real-time analytics for trading activity, volume analysis, and market data.

## Features

- **Orderbook Tracking**: Real-time monitoring of trades and market depth
- **Account Analytics**: Individual trader statistics and activity tracking
- **Volume Analysis**: Comprehensive volume metrics with scaled calculations
- **Price Tracking**: Real-time price calculations and trade side identification
- **Fee Analytics**: Fee collection and distribution tracking

## Data Entities

- **Orderbook**: Market orderbook state and trading statistics
- **OrderFilledEvent**: Individual trade execution records
- **OrdersMatchedEvent**: Order matching events
- **MarketData**: Market metadata and condition information
- **Account**: Individual trader statistics and activity
- **Global**: Platform-wide statistics and metrics
- **OrdersMatchedGlobal**: Global order matching statistics

## Quick Start

```bash
# Install dependencies
npm install

# Generate types
npm run codegen

# Build subgraph
npm run build

# Deploy to Graph Studio
npm run deploy
```

## Sample Queries

### Get Orderbook Data
```graphql
{
  orderbooks(first: 5) {
    id
    tradesQuantity
    buysQuantity
    sellsQuantity
    collateralVolume
    scaledCollateralVolume
    averageTradeSize
    totalFees
  }
}
```

### Get Recent Trades
```graphql
{
  orderFilledEvents(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    transactionHash
    timestamp
    maker
    taker
    makerAssetId
    takerAssetId
    makerAmountFilled
    takerAmountFilled
    fee
    side
    price
  }
}
```

### Get Account Statistics
```graphql
{
  accounts(first: 10, orderBy: tradesQuantity, orderDirection: desc) {
    id
    tradesQuantity
    totalVolume
    totalFees
    firstTrade
    lastTrade
    isActive
  }
}
```

### Get Global Statistics
```graphql
{
  global(id: "") {
    tradesQuantity
    collateralVolume
    scaledCollateralVolume
    collateralFees
    scaledCollateralFees
    uniqueTraders
    activeMarkets
  }
}
```

### Get Market Data
```graphql
{
  marketData(id: "YOUR_TOKEN_ID") {
    id
    condition
    outcomeIndex
  }
}
```

### Get Orders Matched Events
```graphql
{
  ordersMatchedEvents(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    makerAssetID
    takerAssetID
    makerAmountFilled
    takerAmountFilled
    blockNumber
  }
}
```

## Deployment

The subgraph is deployed on Graph Studio at:
```
https://api.studio.thegraph.com/query/92142/polymarket-orderbook/0.0.21
```

## Contracts

- **Exchange**: `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E`
- **NegRiskExchange**: `0xC5d563A36AE78145C45a50134d48A1215220f80a`

## License

MIT License