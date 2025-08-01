# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2024-12-19

### Added
- Professional README.md with comprehensive project documentation
- Complete test suite with basic, detailed, and comprehensive test scripts
- Cross-subgraph integration analysis for Polymarket Names subgraph
- Deployment monitoring and data validation scripts
- Market ID generation improvements for better data consistency
- ConditionId mapping fixes in event handlers
- Test documentation and usage instructions

### Changed
- Improved market ID generation from `makerAssetId` to `makerAssetId-takerAssetId` format
- Enhanced conditionId handling in `getOrCreateMarket` function
- Updated TokenRegistered event mapping to use real conditionIds
- Refined .gitignore for better project organization

### Fixed
- ConditionId mapping issues causing null question/description fields
- Market ID generation inconsistencies in OrderFilled and OrdersMatched events
- Data validation and consistency issues

### Technical Details
- **Files Added**: 18 new files including test scripts and documentation
- **Lines Added**: 1,457 insertions
- **Lines Modified**: 50 deletions
- **Test Coverage**: Comprehensive testing for data integrity, performance, and edge cases

## [1.0.0] - Initial Release

### Added
- Basic Graph Protocol subgraph for Polymarket orderbook data
- Core entities: Market, OrderBook, Order, OrderFill, MarketDepth, Spread, OrderFlow
- Event handlers for CTF Exchange and CTF contracts
- Basic market microstructure analytics 