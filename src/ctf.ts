import {
  ConditionPreparation as ConditionPreparationEvent,
  ConditionResolution as ConditionResolutionEvent,
} from "../generated/CTF/CTF"
import {
  Market,
  Outcome,
} from "../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function handleConditionPreparation(event: ConditionPreparationEvent): void {
  let conditionId = event.params.conditionId
  let marketId = conditionId.toHexString()
  
  let market = Market.load(marketId)
  if (!market) {
    market = new Market(marketId)
    market.conditionId = conditionId
    market.marketId = marketId
    market.outcomeSlotCount = BigInt.fromI32(2) // Default to 2 outcomes
    market.totalVolume = BigInt.fromI32(0)
    market.totalTrades = BigInt.fromI32(0)
    market.endDate = event.params.endTime // Map endTime to endDate
    market.createdAt = event.block.timestamp
    market.updatedAt = event.block.timestamp
    market.save()
  }
}

export function handleConditionResolution(event: ConditionResolutionEvent): void {
  let conditionId = event.params.conditionId
  let marketId = conditionId.toHexString()
  
  let market = Market.load(marketId)
  if (market) {
    market.updatedAt = event.block.timestamp
    market.save()
  }
}
