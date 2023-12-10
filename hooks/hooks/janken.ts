function hook(reserved: i32) {
    if (Tx.TransactionType != TransactionType.Payment)
      rollback("Rejected by non-Payment transaction.");
    const amount = Tx.Amount;
    if (!amount.isXrp()) {
      rollback("Rejected by non-Native payment.");
    }
    const memos = Tx.Memos
    if (!memos)
        accept("Passing non-memo transaction.")
    // blacklist参考にtypeでvalidationをかける
    const memos_array = SerializedArrayView.fromByteArray(Tx.Memos)
    const memo_wrapper = new SerializedObjectView<ObjectField>(memos_array[0])
    const memo = memo_wrapper[ObjectField.Memo]
    console.log(memo.toString())

    // じゃんけん

    // emit

    accept();
}
