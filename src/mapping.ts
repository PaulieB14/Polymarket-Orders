import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts"
import {
  OrderFilled,
  OrdersMatched,
  TokenRegistered,
  ConditionPreparation,
  ConditionResolution
} from "../generated/Polymarket/Polymarket"
import { 
  OrderFilledEvent, 
  EnrichedOrderFilled, 
  Orderbook, 
  Condition, 
  Account,
  Global,
  OrdersMatchedGlobal
} from "../generated/schema"

export function handleOrderFilled(event: OrderFilled): void {
  let id = event.transaction.hash.toHexString() + "_" + event.params.orderHash.toHexString()
  
  let orderFilled = new OrderFilledEvent(id)
  orderFilled.transactionHash = event.transaction.hash
  orderFilled.timestamp = event.block.timestamp
  orderFilled.orderHash = event.params.orderHash
  orderFilled.makerAssetId = event.params.makerAssetId.toString()
  orderFilled.takerAssetId = event.params.takerAssetId.toString()
  orderFilled.makerAmountFilled = event.params.makerAmountFilled
  orderFilled.takerAmountFilled = event.params.takerAmountFilled
  orderFilled.fee = event.params.fee
  
  // Get or create maker account
  let maker = Account.load(event.params.maker.toHexString())
  if (!maker) {
    maker = new Account(event.params.maker.toHexString())
    maker.creationTimestamp = event.block.timestamp
    maker.collateralVolume = BigInt.fromI32(0)
    maker.numTrades = BigInt.fromI32(0)
    maker.scaledCollateralVolume = BigDecimal.fromString("0")
    maker.profit = BigInt.fromI32(0)
    maker.scaledProfit = BigDecimal.fromString("0")
  }
  maker.lastSeenTimestamp = event.block.timestamp
  maker.lastTradedTimestamp = event.block.timestamp
  maker.numTrades = maker.numTrades.plus(BigInt.fromI32(1))
  maker.save()
  
  // Get or create taker account
  let taker = Account.load(event.params.taker.toHexString())
  if (!taker) {
    taker = new Account(event.params.taker.toHexString())
    taker.creationTimestamp = event.block.timestamp
    taker.collateralVolume = BigInt.fromI32(0)
    taker.numTrades = BigInt.fromI32(0)
    taker.scaledCollateralVolume = BigDecimal.fromString("0")
    taker.profit = BigInt.fromI32(0)
    taker.scaledProfit = BigDecimal.fromString("0")
  }
  taker.lastSeenTimestamp = event.block.timestamp
  taker.lastTradedTimestamp = event.block.timestamp
  taker.numTrades = taker.numTrades.plus(BigInt.fromI32(1))
  taker.save()
  
  orderFilled.maker = maker.id
  orderFilled.taker = taker.id
  orderFilled.save()
  
  // Update global stats
  let global = Global.load("")
  if (!global) {
    global = new Global("")
    global.numConditions = 0
    global.numOpenConditions = 0
    global.numClosedConditions = 0
    global.numTraders = BigInt.fromI32(0)
    global.tradesQuantity = BigInt.fromI32(0)
    global.buysQuantity = BigInt.fromI32(0)
    global.sellsQuantity = BigInt.fromI32(0)
    global.collateralVolume = BigInt.fromI32(0)
    global.scaledCollateralVolume = BigDecimal.fromString("0")
    global.collateralFees = BigInt.fromI32(0)
    global.scaledCollateralFees = BigDecimal.fromString("0")
    global.collateralBuyVolume = BigInt.fromI32(0)
    global.scaledCollateralBuyVolume = BigDecimal.fromString("0")
    global.collateralSellVolume = BigInt.fromI32(0)
    global.scaledCollateralSellVolume = BigDecimal.fromString("0")
  }
  global.tradesQuantity = global.tradesQuantity.plus(BigInt.fromI32(1))
  global.collateralVolume = global.collateralVolume.plus(event.params.makerAmountFilled)
  global.scaledCollateralVolume = global.scaledCollateralVolume.plus(
    event.params.makerAmountFilled.toBigDecimal().div(BigDecimal.fromString("1000000"))
  )
  global.collateralFees = global.collateralFees.plus(event.params.fee)
  global.scaledCollateralFees = global.scaledCollateralFees.plus(
    event.params.fee.toBigDecimal().div(BigDecimal.fromString("1000000"))
  )
  global.save()
  
  // Update orderbook stats
  let orderbookId = event.params.takerAssetId.toString()
  let orderbook = Orderbook.load(orderbookId)
  if (!orderbook) {
    orderbook = new Orderbook(orderbookId)
    orderbook.tradesQuantity = BigInt.fromI32(0)
    orderbook.buysQuantity = BigInt.fromI32(0)
    orderbook.sellsQuantity = BigInt.fromI32(0)
    orderbook.collateralVolume = BigInt.fromI32(0)
    orderbook.scaledCollateralVolume = BigDecimal.fromString("0")
    orderbook.collateralBuyVolume = BigInt.fromI32(0)
    orderbook.scaledCollateralBuyVolume = BigDecimal.fromString("0")
    orderbook.collateralSellVolume = BigInt.fromI32(0)
    orderbook.scaledCollateralSellVolume = BigDecimal.fromString("0")
    orderbook.lastActiveDay = event.block.timestamp.div(BigInt.fromI32(86400))
  }
  orderbook.tradesQuantity = orderbook.tradesQuantity.plus(BigInt.fromI32(1))
  orderbook.collateralVolume = orderbook.collateralVolume.plus(event.params.makerAmountFilled)
  orderbook.scaledCollateralVolume = orderbook.scaledCollateralVolume.plus(
    event.params.makerAmountFilled.toBigDecimal().div(BigDecimal.fromString("1000000"))
  )
  orderbook.lastActiveDay = event.block.timestamp.div(BigInt.fromI32(86400))
  orderbook.save()
}

export function handleOrdersMatched(event: OrdersMatched): void {
  // Update global orders matched stats
  let global = OrdersMatchedGlobal.load("")
  if (!global) {
    global = new OrdersMatchedGlobal("")
    global.tradesQuantity = BigInt.fromI32(0)
    global.buysQuantity = BigInt.fromI32(0)
    global.sellsQuantity = BigInt.fromI32(0)
    global.collateralVolume = BigDecimal.fromString("0")
    global.scaledCollateralVolume = BigDecimal.fromString("0")
    global.collateralBuyVolume = BigDecimal.fromString("0")
    global.scaledCollateralBuyVolume = BigDecimal.fromString("0")
    global.collateralSellVolume = BigDecimal.fromString("0")
    global.scaledCollateralSellVolume = BigDecimal.fromString("0")
  }
  global.tradesQuantity = global.tradesQuantity.plus(BigInt.fromI32(1))
  global.save()
}

export function handleTokenRegistered(event: TokenRegistered): void {
  // Handle token registration events
  // This would typically create or update market data
}

export function handleConditionPreparation(event: ConditionPreparation): void {
  let conditionId = event.params.conditionId.toHexString()
  let condition = new Condition(conditionId)
  condition.oracle = event.params.oracle
  condition.questionId = event.params.questionId
  condition.outcomeSlotCount = event.params.outcomeSlotCount.toI32()
  condition.resolutionTimestamp = null
  condition.save()
  
  // Update global stats
  let global = Global.load("")
  if (global) {
    global.numConditions = global.numConditions + 1
    global.numOpenConditions = global.numOpenConditions + 1
    global.save()
  }
}

export function handleConditionResolution(event: ConditionResolution): void {
  let conditionId = event.params.conditionId.toHexString()
  let condition = Condition.load(conditionId)
  if (condition) {
    condition.resolutionTimestamp = event.block.timestamp
    condition.payoutNumerators = event.params.payoutNumerators
    condition.resolutionHash = event.transaction.hash
    condition.save()
    
    // Update global stats
    let global = Global.load("")
    if (global) {
      global.numOpenConditions = global.numOpenConditions - 1
      global.numClosedConditions = global.numClosedConditions + 1
      global.save()
    }
  }
}