/*
deposit hook for user
*/
function hook(reserved: i32) {
  if (Tx.TransactionType != TransactionType.Payment)
    rollback("Rejected by non-Payment transaction.");
  const amount = Tx.Amount;
  if (!amount.isXrp()) {
    rollback("Rejected by non-Native payment.");
  }
  if (amount.drops <= 2000000) {
    rollback("Rejected by amount less than 2000000.");
  }

  etxn_reserve(1);
  const sender = Tx.Account;
  const fee = 20000; // 0.02 XRP
  const newAmount = Amount.fromDrops(amount.drops - fee);

  const hash = emit({
    transactionType: TransactionType.CheckCreate,
    destination: sender,
    sendMax: newAmount,
  })

  // set new max size
  const maxSizeBuf = LocalState.getItem("maxSize");
  let maxSize: u32;
  if (maxSizeBuf) {
    maxSize = maxSizeBuf.toUInt()
  } else {
    maxSize = 0;
  }
  let newSize: u32;
  if (!maxSize) {
    newSize = 1;
  } else {
    newSize = maxSize+1;
  }

  /*
  save state
  key: masSize, value: <max size of hashes>
  key: <i>, value: <emitted hash>
  */
  LocalState.setItem(newSize.toString(), new ByteView(hash, 0, hash.length));
  LocalState.setItem("maxSize", new ByteView(ByteArray.fromUInt(newSize), 0, 1));


  accept();
}
