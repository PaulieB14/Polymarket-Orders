# Polymarket Orders Subgraph (Enhanced)

A professional-grade subgraph for indexing Polymarket order data on Polygon, featuring comprehensive tooling, testing, and deployment options.

## 🚀 Features

- **Professional Tooling**: ESLint, Prettier, TypeScript configuration
- **Multiple Deployment Options**: Graph Studio, Goldsky, Local development
- **Docker Support**: Complete local development environment
- **Comprehensive Indexing**: Order fills, matches, conditions, and more
- **Production Ready**: Optimized for high-performance indexing

## 📋 Prerequisites

- Node.js >= 16.0.0
- Docker and Docker Compose (for local development)
- Graph CLI: `npm install -g @graphprotocol/graph-cli`

## 🛠️ Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd polymarket-orders-fixed

# Install dependencies
npm install

# Generate types and build
npm run prepare
```

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Local Development

```bash
# Start local Graph Node environment
docker-compose up -d

# Create local subgraph
npm run create-local

# Deploy to local environment
npm run deploy-local

# Access GraphQL playground
# http://localhost:8000/subgraphs/name/polymarket-orders-fixed/graphql
```

### Testing

```bash
# Run tests (when configured)
npm run test

# Watch mode
npm run test:watch
```

## 🚀 Deployment

### Graph Studio (Recommended)

```bash
# Authenticate with Graph Studio
graph auth 9583a39f18d46611533f8afe3d548174

# Deploy to Graph Studio
npm run studio
```

### Goldsky

```bash
# Install Goldsky CLI
npm install -g @goldsky/cli

# Deploy to Goldsky
npm run deploy:goldsky
```

### Manual Deployment

```bash
# Generate and build
npm run codegen && npm run build

# Deploy with custom options
graph deploy --node <your-node-url> <subgraph-name>
```

## 📊 Schema

The subgraph indexes the following entities:

- **Global**: Overall statistics and metrics
- **Account**: User account information
- **Condition**: Market conditions and outcomes
- **OrderFilledEvent**: Individual order fill events
- **EnrichedOrderFilled**: Enhanced order fill data
- **Orderbook**: Order book statistics
- **OrdersMatchedGlobal**: Global order matching statistics

## 🔗 Contract Information

- **Network**: Polygon (matic)
- **Contract**: `0x6A9D222616C90FcA5754cd1333cFD9b7fb6a4F74`
- **Start Block**: 40000000

## 📝 Events Indexed

- `OrderFilled`: Order execution events
- `OrdersMatched`: Order matching events
- `TokenRegistered`: Token registration events
- `ConditionPreparation`: Market condition setup
- `ConditionResolution`: Market condition resolution

## 🐳 Docker Development

The project includes a complete Docker setup for local development:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f graph-node

# Stop services
docker-compose down

# Clean up volumes
docker-compose down -v
```

## 📁 Project Structure

```
polymarket-orders-fixed/
├── abis/                    # Contract ABIs
├── src/                     # Mapping source code
├── generated/               # Generated types (auto)
├── build/                   # Build artifacts (auto)
├── schema.graphql           # GraphQL schema
├── subgraph.yaml           # Subgraph manifest
├── docker-compose.yml      # Local development setup
├── matchstick.yaml         # Test configuration
├── .eslintrc.js           # ESLint configuration
├── .prettierrc.js         # Prettier configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔍 Query Examples

### Get Global Statistics
```graphql
query {
  globals(first: 1) {
    id
    tradesQuantity
    collateralVolume
    collateralFees
  }
}
```

### Get Recent Order Fills
```graphql
query {
  orderFilledEvents(
    first: 10
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    maker
    taker
    makerAmountFilled
    takerAmountFilled
    fee
    timestamp
  }
}
```

### Get Orderbook Statistics
```graphql
query {
  orderbooks(first: 10) {
    id
    tradesQuantity
    collateralVolume
    lastActiveDay
  }
}
```

## 🛡️ Security

- All dependencies are regularly updated
- Code is linted and formatted for consistency
- TypeScript provides type safety
- Comprehensive error handling in mappings

## 📈 Performance

- Optimized event handlers for high-throughput indexing
- Efficient data structures for fast queries
- Minimal storage footprint
- Indexed fields for common query patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting
5. Test your changes
6. Submit a pull request

## 📄 License

This project is licensed under the LGPL-3.0 License.

## 🔗 Links

- [The Graph Documentation](https://thegraph.com/docs/)
- [Polymarket](https://polymarket.com/)
- [Graph Studio](https://studio.thegraph.com/)
- [Goldsky](https://goldsky.com/)

## 🆘 Support

For issues and questions:
- Create an issue in this repository
- Check the Graph documentation
- Join The Graph Discord community