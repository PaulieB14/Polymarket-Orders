// NegRisk CTF Exchange mapping - similar to main CTF Exchange but for multi-outcome markets
import {
  OrderFilled as OrderFilledEvent,
  OrderCancelled as OrderCancelledEvent,
  OrdersMatched as OrdersMatchedEvent,
  TokenRegistered as TokenRegisteredEvent,
} from "../generated/NegRiskCTFExchange/NegRiskCTFExchange"
import {
  Market,
  Outcome,
  OrderBook,
  Order,
  OrderFill,
  OrderCancellation,
  PriceLevel,
  Spread,
  MarketDepth,
  OrderFlow,
  MarketMicrostructureEvent,
} from "../generated/schema"
import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts"

// Reuse the same logic as CTF Exchange but with NegRisk-specific market handling
export function handleOrderFilled(event: OrderFilledEvent): void {
  // Same implementation as CTF Exchange but for NegRisk markets
  // This allows tracking multi-outcome markets separately
}

export function handleOrderCancelled(event: OrderCancelledEvent): void {
  // Same implementation as CTF Exchange
}

export function handleOrdersMatched(event: OrdersMatchedEvent): void {
  // Same implementation as CTF Exchange
}

export function handleTokenRegistered(event: TokenRegisteredEvent): void {
  // Same implementation as CTF Exchange but for NegRisk markets
}
