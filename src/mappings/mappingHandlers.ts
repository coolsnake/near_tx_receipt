import {  NearTxReceiptsEntity } from "../types";
import {
  NearTransaction,
  NearBlock,
  NearAction,
  Transfer,
} from "@subql/types-near";


export async function handleTransaction(
  transaction: NearTransaction
): Promise<void> {
  logger.info(`Handling transaction at ${transaction.block_height}`);

  const finalExecutionOutcome = await api.txStatusReceipts(
    transaction.result.id,
    transaction.signer_id
  )
  const receipt_ids = finalExecutionOutcome.receipts_outcome.map((outcome) => outcome.id);
  //logger.info(JSON.stringify(receipt_ids));
  for(const element of receipt_ids) {
    //logger.info(element);
    const trans_receipts_record = NearTxReceiptsEntity.create({
      id: `${transaction.block_hash}-${transaction.result.id}`,
      tx_id: transaction.result.id,
      receipt_id: element
    })
    await trans_receipts_record.save();
  }
}
