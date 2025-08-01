import {
  OrderFilled as OrderFilledEvent,
  OrderCancelled as OrderCancelledEvent,
  OrdersMatched as OrdersMatchedEvent,
  TokenRegistered as TokenRegisteredEvent,
} from "../generated/CTFExchange/CTFExchange"
import {
  Market,
  Outcome,
  OrderBook,
  Order,
  OrderFill,
  OrderCancellation,
  Spread,
  MarketDepth,
  OrderFlow,
  MarketMicrostructureEvent,
} from "../generated/schema"
import { BigInt, BigDecimal, Bytes } from "@graphprotocol/graph-ts"

// Helper function to get or create market
function getOrCreateMarket(marketId: string): Market {
  let market = Market.load(marketId)
  if (!market) {
    market = new Market(marketId)
    // Always use default conditionId for safety
    let conditionId = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000000")
    market.conditionId = conditionId
    market.marketId = marketId
    market.outcomeSlotCount = BigInt.fromI32(2)
    market.totalVolume = BigInt.fromI32(0)
    market.totalTrades = BigInt.fromI32(0)
    market.createdAt = BigInt.fromI32(0)
    market.updatedAt = BigInt.fromI32(0)
    market.save()
    
    // Create orderbook
    let orderbook = new OrderBook(marketId)
    orderbook.marketId = marketId
    orderbook.bidDepthLevels = 0
    orderbook.askDepthLevels = 0
    orderbook.totalBidDepth = BigInt.fromI32(0)
    orderbook.totalAskDepth = BigInt.fromI32(0)
    orderbook.lastUpdate = BigInt.fromI32(0)
    orderbook.createdAt = BigInt.fromI32(0)
    orderbook.save()
    
    // Create spread tracking
    let spread = new Spread(marketId)
    spread.marketId = marketId
    spread.currentSpread = BigInt.fromI32(0)
    spread.currentSpreadPercentage = BigDecimal.fromString("0")
    spread.minSpread = BigInt.fromI32(0)
    spread.maxSpread = BigInt.fromI32(0)
    spread.avgSpread = BigDecimal.fromString("0")
    spread.spreadVolatility = BigDecimal.fromString("0")
    spread.lastUpdate = BigInt.fromI32(0)
    spread.createdAt = BigInt.fromI32(0)
    spread.save()
    
    // Create market depth tracking
    let marketDepth = new MarketDepth(marketId)
    marketDepth.marketId = marketId
    marketDepth.totalBidDepth = BigInt.fromI32(0)
    marketDepth.totalAskDepth = BigInt.fromI32(0)
    marketDepth.depthImbalance = BigDecimal.fromString("0")
    marketDepth.depthAt1Percent = BigInt.fromI32(0)
    marketDepth.depthAt5Percent = BigInt.fromI32(0)
    marketDepth.depthAt10Percent = BigInt.fromI32(0)
    marketDepth.bidLiquidity = BigDecimal.fromString("0")
    marketDepth.askLiquidity = BigDecimal.fromString("0")
    marketDepth.lastUpdate = BigInt.fromI32(0)
    marketDepth.createdAt = BigInt.fromI32(0)
    marketDepth.save()
    
    // Create order flow tracking
    let orderFlow = new OrderFlow(marketId)
    orderFlow.marketId = marketId
    orderFlow.buyFlow = BigInt.fromI32(0)
    orderFlow.sellFlow = BigInt.fromI32(0)
    orderFlow.netFlow = BigInt.fromI32(0)
    orderFlow.buySellRatio = BigDecimal.fromString("0")
    orderFlow.orderFlowImbalance = BigDecimal.fromString("0")
    orderFlow.flow1Min = BigInt.fromI32(0)
    orderFlow.flow5Min = BigInt.fromI32(0)
    orderFlow.flow15Min = BigInt.fromI32(0)
    orderFlow.lastUpdate = BigInt.fromI32(0)
    orderFlow.createdAt = BigInt.fromI32(0)
    orderFlow.save()
  }
  return market
}

export function handleOrderFilled(event: OrderFilledEvent): void {
  let marketId = event.params.makerAssetId.toString()
  let market = getOrCreateMarket(marketId)
  
  // Create order fill record
  let fillId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let fill = new OrderFill(fillId)
  fill.order = event.params.orderHash.toHexString()
  fill.marketId = marketId
  fill.outcomeIndex = BigInt.fromI32(0)
  fill.maker = event.params.maker
  fill.taker = event.params.taker
  fill.price = event.params.makerAmountFilled
  fill.size = event.params.takerAmountFilled
  fill.fee = event.params.fee
  fill.timestamp = event.block.timestamp
  fill.blockNumber = event.block.number
  fill.transactionHash = event.transaction.hash
  fill.save()
  
  // Update market statistics
  market.totalVolume = market.totalVolume.plus(event.params.takerAmountFilled)
  market.totalTrades = market.totalTrades.plus(BigInt.fromI32(1))
  market.lastTradePrice = event.params.makerAmountFilled
  market.lastTradeTimestamp = event.block.timestamp
  market.updatedAt = event.block.timestamp
  market.save()
  
  // Update order flow analytics
  let orderFlow = OrderFlow.load(marketId)
  if (orderFlow) {
    orderFlow.buyFlow = orderFlow.buyFlow.plus(event.params.takerAmountFilled)
    orderFlow.netFlow = orderFlow.netFlow.plus(event.params.takerAmountFilled)
    orderFlow.lastUpdate = event.block.timestamp
    orderFlow.save()
  }
}

export function handleOrderCancelled(event: OrderCancelledEvent): void {
  let orderId = event.params.orderHash.toHexString()
  let order = Order.load(orderId)
  
  if (order) {
    order.status = "CANCELLED"
    order.cancelledAt = event.block.timestamp
    order.save()
    
    // Create cancellation record
    let cancellationId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    let cancellation = new OrderCancellation(cancellationId)
    cancellation.order = orderId
    cancellation.marketId = order.marketId
    cancellation.outcomeIndex = order.outcomeIndex
    cancellation.cancelledSize = order.remainingSize
    cancellation.timestamp = event.block.timestamp
    cancellation.blockNumber = event.block.number
    cancellation.transactionHash = event.transaction.hash
    cancellation.save()
  }
}

export function handleOrdersMatched(event: OrdersMatchedEvent): void {
  let marketId = event.params.makerAssetId.toString()
  let market = getOrCreateMarket(marketId)
  
  // Update market statistics
  market.totalVolume = market.totalVolume.plus(event.params.makerAmountFilled)
  market.totalTrades = market.totalTrades.plus(BigInt.fromI32(1))
  market.updatedAt = event.block.timestamp
  market.save()
  
  // Update order flow analytics (enhanced)
  let orderFlow = OrderFlow.load(marketId)
  if (orderFlow) {
    orderFlow.sellFlow = orderFlow.sellFlow.plus(event.params.makerAmountFilled)
    orderFlow.netFlow = orderFlow.netFlow.minus(event.params.makerAmountFilled)
    orderFlow.lastUpdate = event.block.timestamp
    orderFlow.save()
  }
}

export function handleTokenRegistered(event: TokenRegisteredEvent): void {
  let conditionId = event.params.conditionId
  // Use a safer approach - create marketId from transaction hash and log index
  let marketId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let market = getOrCreateMarket(marketId)
  
  // Update market metadata
  market.outcomeSlotCount = BigInt.fromI32(2)
  market.createdAt = event.block.timestamp
  market.updatedAt = event.block.timestamp
  market.save()
}
