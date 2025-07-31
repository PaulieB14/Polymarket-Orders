// CTF Contract mapping for market metadata and condition tracking
import {
  ConditionPreparation,
  ConditionResolution,
} from "../generated/CTF/CTF"
import {
  Market,
  Outcome,
} from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

export function handleConditionPreparation(event: ConditionPreparation): void {
  let conditionId = event.params.conditionId.toHexString()
  let market = Market.load(conditionId)
  
  if (market) {
    // Update market with preparation data
    market.endDate = event.params.endTime
    market.updatedAt = event.block.timestamp
    market.save()
  }
}

export function handleConditionResolution(event: ConditionResolution): void {
  let conditionId = event.params.conditionId.toHexString()
  let market = Market.load(conditionId)
  
  if (market) {
    // Update market with resolution data
    // This could include the winning outcome, resolution source, etc.
    market.updatedAt = event.block.timestamp
    market.save()
    
    // Update the winning outcome
    let winningOutcomeIndex = event.params.outcomeSlotCount
    let outcomeId = conditionId + "-" + winningOutcomeIndex.toString()
    let outcome = Outcome.load(outcomeId)
    
    if (outcome) {
      // Mark this outcome as the winning one
      outcome.save()
    }
  }
}
