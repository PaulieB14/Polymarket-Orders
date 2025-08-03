import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import {
  OrderFilled,
  OrdersMatched,
  TokenRegistered,
} from '../generated/Exchange/Exchange';
import {
  MarketData,
  Orderbook,
  OrderFilledEvent,
  OrdersMatchedEvent,
  OrdersMatchedGlobal,
  Global,
  Account,
} from '../generated/schema';

// Constants
const TRADE_TYPE_BUY = 'buy';
const TRADE_TYPE_SELL = 'sell';
const COLLATERAL_SCALE = BigDecimal.fromString('1000000'); // 10^6 for USDC

// Utility functions
function getOrderSide(makerAssetId: BigInt): string {
  // If makerAssetId is 0, it's a buy (buying the taker asset)
  // Otherwise, it's a sell (selling the maker asset)
  return makerAssetId.equals(BigInt.fromI32(0)) ? TRADE_TYPE_BUY : TRADE_TYPE_SELL;
}

function getOrderSize(makerAmount: BigInt, takerAmount: BigInt, side: string): BigInt {
  return side === TRADE_TYPE_BUY ? takerAmount : makerAmount;
}

function requireOrderBook(tokenId: string): Orderbook {
  let orderBook = Orderbook.load(tokenId);
  if (!orderBook) {
    // Ensure MarketData exists first
    let marketData = MarketData.load(tokenId);
    if (!marketData) {
      // Create a placeholder MarketData if it doesn't exist
      marketData = new MarketData(tokenId);
      marketData.condition = "unknown"; // placeholder
      marketData.outcomeIndex = null;
      marketData.save();
    }
    
    orderBook = new Orderbook(tokenId);
    orderBook.tradesQuantity = BigInt.fromI32(0);
    orderBook.buysQuantity = BigInt.fromI32(0);
    orderBook.sellsQuantity = BigInt.fromI32(0);
    orderBook.collateralVolume = BigInt.fromI32(0);
    orderBook.scaledCollateralVolume = BigDecimal.fromString('0');
    orderBook.collateralBuyVolume = BigInt.fromI32(0);
    orderBook.scaledCollateralBuyVolume = BigDecimal.fromString('0');
    orderBook.collateralSellVolume = BigInt.fromI32(0);
    orderBook.scaledCollateralSellVolume = BigDecimal.fromString('0');
    orderBook.lastActiveDay = BigInt.fromI32(0);
    orderBook.averageTradeSize = BigDecimal.fromString('0');
    orderBook.totalFees = BigInt.fromI32(0);
  }
  return orderBook;
}

function requireGlobal(): Global {
  let global = Global.load('');
  if (!global) {
    global = new Global('');
    global.tradesQuantity = BigInt.fromI32(0);
    global.collateralVolume = BigInt.fromI32(0);
    global.scaledCollateralVolume = BigDecimal.fromString('0');
    global.collateralFees = BigInt.fromI32(0);
    global.scaledCollateralFees = BigDecimal.fromString('0');
    global.uniqueTraders = BigInt.fromI32(0);
    global.activeMarkets = BigInt.fromI32(0);
  }
  return global;
}

function requireOrdersMatchedGlobal(): OrdersMatchedGlobal {
  let global = OrdersMatchedGlobal.load('');
  if (!global) {
    global = new OrdersMatchedGlobal('');
    global.tradesQuantity = BigInt.fromI32(0);
    global.buysQuantity = BigInt.fromI32(0);
    global.sellsQuantity = BigInt.fromI32(0);
    global.collateralVolume = BigDecimal.fromString('0');
    global.scaledCollateralVolume = BigDecimal.fromString('0');
    global.collateralBuyVolume = BigDecimal.fromString('0');
    global.scaledCollateralBuyVolume = BigDecimal.fromString('0');
    global.collateralSellVolume = BigDecimal.fromString('0');
    global.scaledCollateralSellVolume = BigDecimal.fromString('0');
    global.totalFees = BigInt.fromI32(0);
    global.averageTradeSize = BigDecimal.fromString('0');
  }
  return global;
}

function getOrCreateAccount(address: string): Account {
  let account = Account.load(address);
  if (!account) {
    account = new Account(address);
    account.tradesQuantity = BigInt.fromI32(0);
    account.totalVolume = BigInt.fromI32(0);
    account.totalFees = BigInt.fromI32(0);
    account.firstTrade = BigInt.fromI32(0);
    account.lastTrade = BigInt.fromI32(0);
    account.isActive = false;
  }
  return account;
}

function recordOrderFilledEvent(event: OrderFilled): string {
  let eventId = event.transaction.hash.toHexString() + '_' + event.params.orderHash.toHexString();
  
  let orderFilledEvent = new OrderFilledEvent(eventId);
  orderFilledEvent.transactionHash = event.transaction.hash;
  orderFilledEvent.timestamp = event.block.timestamp;
  orderFilledEvent.blockNumber = event.block.number;
  orderFilledEvent.orderHash = event.params.orderHash;
  orderFilledEvent.maker = event.params.maker.toHexString();
  orderFilledEvent.taker = event.params.taker.toHexString();
  orderFilledEvent.makerAssetId = event.params.makerAssetId.toString();
  orderFilledEvent.takerAssetId = event.params.takerAssetId.toString();
  orderFilledEvent.makerAmountFilled = event.params.makerAmountFilled;
  orderFilledEvent.takerAmountFilled = event.params.takerAmountFilled;
  orderFilledEvent.fee = event.params.fee;
  
  // Calculate trade side and price
  let side = getOrderSide(event.params.makerAssetId);
  orderFilledEvent.side = side;
  
  // Calculate price (taker amount / maker amount)
  if (event.params.makerAmountFilled.gt(BigInt.fromI32(0))) {
    let price = event.params.takerAmountFilled.toBigDecimal().div(event.params.makerAmountFilled.toBigDecimal());
    orderFilledEvent.price = price;
  } else {
    orderFilledEvent.price = BigDecimal.fromString('0');
  }
  
  orderFilledEvent.save();
  return eventId;
}

function updateVolumes(orderBook: Orderbook, timestamp: BigInt, size: BigInt, side: string): void {
  let scaledSize = size.toBigDecimal().div(COLLATERAL_SCALE);
  
  orderBook.collateralVolume = orderBook.collateralVolume.plus(size);
  orderBook.scaledCollateralVolume = orderBook.scaledCollateralVolume.plus(scaledSize);
  
  if (side === TRADE_TYPE_BUY) {
    orderBook.collateralBuyVolume = orderBook.collateralBuyVolume.plus(size);
    orderBook.scaledCollateralBuyVolume = orderBook.scaledCollateralBuyVolume.plus(scaledSize);
  } else {
    orderBook.collateralSellVolume = orderBook.collateralSellVolume.plus(size);
    orderBook.scaledCollateralSellVolume = orderBook.scaledCollateralSellVolume.plus(scaledSize);
  }
  
  // Update average trade size
  if (orderBook.tradesQuantity.gt(BigInt.fromI32(0))) {
    orderBook.averageTradeSize = orderBook.scaledCollateralVolume.div(orderBook.tradesQuantity.toBigDecimal());
  }
  
  orderBook.lastActiveDay = timestamp.div(BigInt.fromI32(86400));
}

function updateTradesQuantity(orderBook: Orderbook, side: string): void {
  orderBook.tradesQuantity = orderBook.tradesQuantity.plus(BigInt.fromI32(1));
  
  if (side === TRADE_TYPE_BUY) {
    orderBook.buysQuantity = orderBook.buysQuantity.plus(BigInt.fromI32(1));
  } else {
    orderBook.sellsQuantity = orderBook.sellsQuantity.plus(BigInt.fromI32(1));
  }
}

/**
 * Handles individual OrderFilled events
 */
export function handleFill(event: OrderFilled): void {
  let makerAssetId = event.params.makerAssetId;
  let takerAssetId = event.params.takerAssetId;
  let timestamp = event.block.timestamp;
  
  let side = getOrderSide(makerAssetId);
  let size = getOrderSize(event.params.makerAmountFilled, event.params.takerAmountFilled, side);
  
  let tokenId = '';
  if (side === TRADE_TYPE_BUY) {
    tokenId = takerAssetId.toString();
  } else {
    tokenId = makerAssetId.toString();
  }
  
  // Record the event
  recordOrderFilledEvent(event);
  
  // Update order book
  let orderBook = requireOrderBook(tokenId);
  updateVolumes(orderBook, timestamp, size, side);
  updateTradesQuantity(orderBook, side);
  orderBook.totalFees = orderBook.totalFees.plus(event.params.fee);
  orderBook.save();
  
  // Update global stats
  let global = requireGlobal();
  global.tradesQuantity = global.tradesQuantity.plus(BigInt.fromI32(1));
  global.collateralVolume = global.collateralVolume.plus(size);
  global.scaledCollateralVolume = global.scaledCollateralVolume.plus(size.toBigDecimal().div(COLLATERAL_SCALE));
  global.collateralFees = global.collateralFees.plus(event.params.fee);
  global.scaledCollateralFees = global.scaledCollateralFees.plus(event.params.fee.toBigDecimal().div(COLLATERAL_SCALE));
  global.save();
  
  // Update OrdersMatchedGlobal
  let ordersMatchedGlobal = requireOrdersMatchedGlobal();
  ordersMatchedGlobal.tradesQuantity = ordersMatchedGlobal.tradesQuantity.plus(BigInt.fromI32(1));
  if (side === TRADE_TYPE_BUY) {
    ordersMatchedGlobal.buysQuantity = ordersMatchedGlobal.buysQuantity.plus(BigInt.fromI32(1));
    ordersMatchedGlobal.collateralBuyVolume = ordersMatchedGlobal.collateralBuyVolume.plus(size.toBigDecimal().div(COLLATERAL_SCALE));
    ordersMatchedGlobal.scaledCollateralBuyVolume = ordersMatchedGlobal.scaledCollateralBuyVolume.plus(size.toBigDecimal().div(COLLATERAL_SCALE));
  } else {
    ordersMatchedGlobal.sellsQuantity = ordersMatchedGlobal.sellsQuantity.plus(BigInt.fromI32(1));
    ordersMatchedGlobal.collateralSellVolume = ordersMatchedGlobal.collateralSellVolume.plus(size.toBigDecimal().div(COLLATERAL_SCALE));
    ordersMatchedGlobal.scaledCollateralSellVolume = ordersMatchedGlobal.scaledCollateralSellVolume.plus(size.toBigDecimal().div(COLLATERAL_SCALE));
  }
  ordersMatchedGlobal.collateralVolume = ordersMatchedGlobal.collateralVolume.plus(size.toBigDecimal().div(COLLATERAL_SCALE));
  ordersMatchedGlobal.scaledCollateralVolume = ordersMatchedGlobal.scaledCollateralVolume.plus(size.toBigDecimal().div(COLLATERAL_SCALE));
  ordersMatchedGlobal.totalFees = ordersMatchedGlobal.totalFees.plus(event.params.fee);
  
  if (ordersMatchedGlobal.tradesQuantity.gt(BigInt.fromI32(0))) {
    ordersMatchedGlobal.averageTradeSize = ordersMatchedGlobal.scaledCollateralVolume.div(ordersMatchedGlobal.tradesQuantity.toBigDecimal());
  }
  ordersMatchedGlobal.save();
  
  // Update account stats
  let makerAccount = getOrCreateAccount(event.params.maker.toHexString());
  let takerAccount = getOrCreateAccount(event.params.taker.toHexString());
  
  makerAccount.tradesQuantity = makerAccount.tradesQuantity.plus(BigInt.fromI32(1));
  makerAccount.totalVolume = makerAccount.totalVolume.plus(size);
  makerAccount.totalFees = makerAccount.totalFees.plus(event.params.fee);
  makerAccount.lastTrade = timestamp;
  if (makerAccount.firstTrade.equals(BigInt.fromI32(0))) {
    makerAccount.firstTrade = timestamp;
  }
  makerAccount.isActive = true;
  makerAccount.save();
  
  takerAccount.tradesQuantity = takerAccount.tradesQuantity.plus(BigInt.fromI32(1));
  takerAccount.totalVolume = takerAccount.totalVolume.plus(size);
  takerAccount.lastTrade = timestamp;
  if (takerAccount.firstTrade.equals(BigInt.fromI32(0))) {
    takerAccount.firstTrade = timestamp;
  }
  takerAccount.isActive = true;
  takerAccount.save();
}

/**
 * Handles OrdersMatched events
 */
export function handleMatch(event: OrdersMatched): void {
  let eventId = event.transaction.hash.toHexString();
  
  let ordersMatchedEvent = new OrdersMatchedEvent(eventId);
  ordersMatchedEvent.timestamp = event.block.timestamp;
  ordersMatchedEvent.blockNumber = event.block.number;
  ordersMatchedEvent.makerAssetID = event.params.makerAssetId;
  ordersMatchedEvent.takerAssetID = event.params.takerAssetId;
  ordersMatchedEvent.makerAmountFilled = event.params.makerAmountFilled;
  ordersMatchedEvent.takerAmountFilled = event.params.takerAmountFilled;
  ordersMatchedEvent.save();
  
  // Update global stats
  let ordersMatchedGlobal = requireOrdersMatchedGlobal();
  ordersMatchedGlobal.tradesQuantity = ordersMatchedGlobal.tradesQuantity.plus(BigInt.fromI32(1));
  ordersMatchedGlobal.save();
}

/**
 * Handles TokenRegistered events
 */
export function handleTokenRegistered(event: TokenRegistered): void {
  let token0Str = event.params.token0.toString();
  let token1Str = event.params.token1.toString();
  let condition = event.params.conditionId.toHexString();

  // Create MarketData for token0 if it doesn't exist
  let data0 = MarketData.load(token0Str);
  if (data0 == null) {
    data0 = new MarketData(token0Str);
    data0.condition = condition;
    data0.outcomeIndex = null;
    data0.save();
  }

  // Create MarketData for token1 if it doesn't exist
  let data1 = MarketData.load(token1Str);
  if (data1 == null) {
    data1 = new MarketData(token1Str);
    data1.condition = condition;
    data1.outcomeIndex = null;
    data1.save();
  }
}
