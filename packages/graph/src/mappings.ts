import {
  TransferEscrow
} from "../generated/OwlhouseFactory/OwlhouseFactory";
import { Escrow } from "../generated/schema";

export function handleEscrow(event: TransferEscrow): void {
  const id = event.params.escrowAddress.toHex()
    
  const escrow = new Escrow(id)

  escrow.lenderAddress = event.params.lenderAddress
  escrow.paymentToken = event.params.paymentToken
  escrow.escrowAddress = event.params.escrowAddress
  escrow.loanStart = event.params.loanStart
  escrow.loanEnd = event.params.loanEnd

  escrow.weiNetWorth = event.params.weiNetWorth
  escrow.weiAssetWorthInterest = event.params.weiAssetWorthInterest
 
  escrow.save()
}