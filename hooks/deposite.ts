class MyObject {
  addr: string;
  amount: i64;
}

function objectToBytes(obj: MyObject): ByteView {
const buffer = new Uint8Array(8); // 2つのi32フィールドのため、合計8バイト
store<string>(changetype<usize>(buffer.buffer), obj.addr, 0); // 最初の4バイトにaddrを格納
store<i64>(changetype<usize>(buffer.buffer), obj.amount, 4); // 次の4バイトにamountを格納

return changetype<ByteView>(buffer);
}

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
  const maxSizeBuf = LocalState.getItem("maxSize");
  let maxSize: u32;
  if (maxSizeBuf) {
    maxSize = maxSizeBuf.toUInt()
  } else {
    maxSize = 0;
  }

  const accid = Tx.Account.toString();

  let newSize: u32;
  if (!maxSize) {
    newSize = 1;
  } else {
    newSize = maxSize+1;
  }
  const strBuf = objectToBytes({addr: accid, amount: amount.drops});

  LocalState.setItem(newSize.toString(), strBuf);
  LocalState.setItem("maxSize", new ByteView(ByteArray.fromUInt(newSize), 0, 1));

  etxn_reserve(1);
  const sender = Tx.Account;
  const fee = 20000; // 0.02 XRP
  const newAmount = Amount.fromDrops(amount.drops - fee);
  emit({
    transactionType: TransactionType.CheckCreate,
    destination: sender,
    sendMax: newAmount,
  })
  // let buffer = ByteArray.fromUInt(<u32>amount.drops);
  // let value_view = new ByteView(buffer, 0, buffer.length);
  // LocalState.setItem(accid, value_view);
  accept();
}
